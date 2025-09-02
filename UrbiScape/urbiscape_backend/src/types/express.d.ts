import 'express';
import type { JwtPayload } from '../utils/jwt.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
 