import express from 'express';
import { trackProgress } from '../controllers/tracking.controller';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

// Ruta protegida para registrar tracking de usuario
router.post('/tracking', authenticate, trackProgress);

export default router;
