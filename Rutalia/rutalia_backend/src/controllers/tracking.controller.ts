import { Request, Response } from 'express';
import Tracking from '../models/Tracking';

export const trackProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user; // asumimos que el middleware auth añade req.user
    const { routeId, milestoneId, location, eventType } = req.body;

    // Validación mínima
    if (!routeId || !milestoneId || !location?.coordinates?.length) {
      return res.status(400).json({ error: 'Datos incompletos o malformateados.' });
    }

    // Guardar nuevo tracking
    const tracking = await Tracking.create({
      userId,
      routeId,
      milestoneId,
      location,
      eventType: eventType || 'reach'
    });

    return res.status(201).json({ success: true, tracking });
  } catch (err) {
    console.error('[Tracking Error]', err);
    return res.status(500).json({ error: 'Error registrando el tracking.' });
  }
};
