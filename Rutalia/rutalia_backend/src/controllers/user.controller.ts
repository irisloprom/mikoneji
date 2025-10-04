import { Request, Response } from 'express';
import { User } from '../models/User.js';

export async function getMe(req: Request, res: Response) {
  const userId = req.user!.sub;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'No encontrado' });
  const { passwordHash, __v, ...clean } = user.toObject();
  res.json(clean);
}
