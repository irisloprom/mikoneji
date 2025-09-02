import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt.js';
import { hashToken, randomToken } from '../utils/crypto.js';
import { verifyFirebaseIdToken } from '../config/firebase.js';
import { add } from 'date-fns';

type IssueOpts = { userAgent?: string; ip?: string };

async function issueTokens(userId: string, role: 'user'|'guest'|'admin', provider: 'local'|'google'|'guest', opts: IssueOpts = {}) {
  const payload: JwtPayload = { sub: userId, role, provider };
  const accessToken = signAccessToken(payload);

  // refresh token raw para el cliente + guardar hash en DB
  const rawRefresh = signRefreshToken(payload); // JWT refresh
  const hashed = await hashToken(rawRefresh);

  const expiresAt = add(new Date(), { days: 30 }); // redundancia a expiración JWT
  await RefreshToken.create({
    user: userId,
    hashedToken: hashed,
    expiresAt,
    userAgent: opts.userAgent,
    ip: opts.ip
  });

  return { accessToken, refreshToken: rawRefresh };
}

export async function registerLocal(email: string, password: string, displayName?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email en uso');

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email, passwordHash, displayName, provider: 'local', role: 'user', lastLoginAt: new Date()
  });
  const tokens = await issueTokens(user.id, user.role, user.provider);
  return { user, tokens };
}

export async function loginLocal(email: string, password: string, opts: IssueOpts = {}) {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) throw new Error('Credenciales inválidas');
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error('Credenciales inválidas');

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokens(user.id, user.role, user.provider, opts);
  return { user, tokens };
}

export async function loginWithGoogle(idToken: string, displayName?: string, opts: IssueOpts = {}) {
  const decoded = await verifyFirebaseIdToken(idToken); // throws si no válido
  const googleUid = decoded.uid;
  const email = decoded.email?.toLowerCase();

  let user = await User.findOne({ googleUid });
  if (!user && email) {
    // Si existe cuenta local con ese email, la "linkeamos" a Google en el primer login
    user = await User.findOne({ email });
    if (user) {
      user.googleUid = googleUid;
      user.provider = 'google';
      if (displayName && !user.displayName) user.displayName = displayName;
      user.lastLoginAt = new Date();
      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      email,
      googleUid,
      displayName: displayName ?? email?.split('@')[0],
      provider: 'google',
      role: 'user',
      lastLoginAt: new Date()
    });
  } else {
    user.lastLoginAt = new Date();
    await user.save();
  }

  const tokens = await issueTokens(user.id, user.role, user.provider, opts);
  return { user, tokens };
}

export async function loginAsGuest(displayName = 'Guest', opts: IssueOpts = {}) {
  const user = await User.create({
    displayName,
    provider: 'guest',
    role: 'guest',
    lastLoginAt: new Date()
  });
  const tokens = await issueTokens(user.id, user.role, user.provider, opts);
  return { user, tokens };
}

export async function refreshSession(rawRefresh: string, opts: IssueOpts = {}) {
  // 1) Verificar firma JWT refresh
  const decoded = verifyRefreshToken(rawRefresh);
  const hashed = await hashToken(rawRefresh);

  // 2) Buscar token activo
  const tokenDoc = await RefreshToken.findOne({ hashedToken: hashed }).populate('user');
  if (!tokenDoc || tokenDoc.revokedAt) throw new Error('Refresh inválido o revocado');

  // 3) Rotación: revocamos el anterior y emitimos uno nuevo
  tokenDoc.revokedAt = new Date();
  await tokenDoc.save();

  const user = tokenDoc.user;
  const payloadProvider = (user as any).provider ?? 'local';
  const { accessToken, refreshToken } = await issueTokens(
    (user as any).id, (user as any).role, payloadProvider, opts
  );

  // Referenciamos el nuevo token
  const newHashed = await hashToken(refreshToken);
  const newDoc = await RefreshToken.findOne({ hashedToken: newHashed });
  if (newDoc) {
    tokenDoc.replacedByTokenId = newDoc._id;
    await tokenDoc.save();
  }
  return { accessToken, refreshToken };
}

export async function logout(rawRefresh: string) {
  const hashed = await hashToken(rawRefresh);
  const tokenDoc = await RefreshToken.findOne({ hashedToken: hashed });
  if (tokenDoc && !tokenDoc.revokedAt) {
    tokenDoc.revokedAt = new Date();
    await tokenDoc.save();
  }
}
