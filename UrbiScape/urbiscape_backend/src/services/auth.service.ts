import crypto from 'crypto';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';
import { verifyFirebaseIdToken } from '../config/firebase.js';
import { env } from '../config/env.js';
import { parseDurationToMs } from '../utils/time.js'; // ✅ NUEVO

type ClientMeta = { userAgent?: string; ip?: string };

type RegisterInput = { email: string; password: string; displayName?: string };
type LoginLocalInput = { email: string; password: string };
type LoginGoogleInput = { idToken: string };

type Tokens = { accessToken: string; refreshToken: string };
type AuthResult = { user: any; tokens: Tokens };

// ❌ Eliminado parseDuration local

function hashRefreshToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createRefreshToken(userId: string) {
  const token = crypto.randomBytes(48).toString('hex');
  const tokenHash = hashRefreshToken(token);

  // ✅ Usa util común
  const expiresMs = parseDurationToMs(env.jwtRefreshExpires, 30 * 24 * 60 * 60 * 1000); // 30d
  const expiresAt = new Date(Date.now() + expiresMs);

  await RefreshToken.create({ user: userId, tokenHash, expiresAt });
  return token;
}

async function rotateRefresh(oldToken: string) {
  const tokenHash = hashRefreshToken(oldToken);
  const doc = await RefreshToken.findOneAndDelete({ tokenHash });
  if (!doc) throw new Error('Invalid refresh token');
  if (doc.expiresAt.getTime() < Date.now()) throw new Error('Expired refresh token');
  return createRefreshToken(String(doc.user));
}

function buildAccessPayload(u: any) {
  return {
    sub: String(u._id),
    role: u.role,
    email: u.email,
    provider: u.provider,
  };
}

async function issueTokens(u: any): Promise<Tokens> {
  const accessToken = signAccessToken(buildAccessPayload(u), env.jwtAccessExpires);
  const refreshToken = await createRefreshToken(String(u._id));
  return { accessToken, refreshToken };
}

/** SANITIZE user for output */
function cleanUser(u: any) {
  const { passwordHash, __v, ...rest } = u.toObject ? u.toObject() : u;
  return rest;
}

/** REGISTER (local) */
export async function registerLocal(input: RegisterInput, _meta?: ClientMeta): Promise<AuthResult> {
  const { email, password, displayName } = input;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('Email ya está en uso');

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email: email.toLowerCase(),
    displayName,
    provider: 'local',
    role: 'user',
    passwordHash,
  });

  const tokens = await issueTokens(user);
  return { user: cleanUser(user), tokens };
}

/** LOGIN (local) */
export async function loginLocal(input: LoginLocalInput, _meta?: ClientMeta): Promise<AuthResult> {
  const { email, password } = input;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) throw new Error('Credenciales inválidas');

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error('Credenciales inválidas');

  const tokens = await issueTokens(user);
  return { user: cleanUser(user), tokens };
}

/** LOGIN (Google via Firebase) */
export async function loginWithGoogle(input: LoginGoogleInput, _meta?: ClientMeta): Promise<AuthResult> {
  const decoded = await verifyFirebaseIdToken(input.idToken);
  const email = decoded.email?.toLowerCase();
  const displayName = decoded.name || decoded.email?.split('@')[0] || 'Usuario';

  let user: any = null;

  if (email) {
    user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        displayName,
        provider: 'google',
        role: 'user',
        photoURL: decoded.picture,
      });
    } else if (user.provider !== 'google') {
      user.provider = 'google';
      user.photoURL = user.photoURL || decoded.picture;
      await user.save();
    }
  } else {
    user = await User.create({
      displayName,
      provider: 'google',
      role: 'user',
      photoURL: decoded.picture,
    });
  }

  const tokens = await issueTokens(user);
  return { user: cleanUser(user), tokens };
}

/** LOGIN (guest) */
export async function loginAsGuest(): Promise<AuthResult> {
  const user = await User.create({
    provider: 'guest',
    role: 'guest',
    displayName: `Invitado-${Math.random().toString(36).slice(2, 8)}`,
  });
  const tokens = await issueTokens(user);
  return { user: cleanUser(user), tokens };
}

/** REFRESH */
export async function refreshSession(refreshToken: string): Promise<{ tokens: Tokens }> {
  const newRefresh = await rotateRefresh(refreshToken);

  // Volvemos a hallar el user del refresh NUEVO
  const tokenHash = hashRefreshToken(newRefresh);
  const doc = await RefreshToken.findOne({ tokenHash }).lean();
  if (!doc) throw new Error('Refresh inconsistente');

  const user = await User.findById(doc.user);
  if (!user) throw new Error('Usuario no encontrado');

  const accessToken = signAccessToken(buildAccessPayload(user), env.jwtAccessExpires);
  return { tokens: { accessToken, refreshToken: newRefresh } };
}

/** LOGOUT (revoca refresh) */
export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);
  await RefreshToken.findOneAndDelete({ tokenHash });
}
