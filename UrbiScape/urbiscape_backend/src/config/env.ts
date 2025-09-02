import 'dotenv/config';

function required(name: string, val?: string) {
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required('MONGO_URI', process.env.MONGO_URI),

  jwtAccessSecret: required('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '30d',

  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH
};
