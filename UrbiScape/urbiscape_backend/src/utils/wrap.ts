// src/utils/wrap.ts
import { Request, Response, NextFunction } from 'express';
export const wrap = (fn: (req: Request, res: Response, next?: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);