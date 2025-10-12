import { Request, Response, NextFunction } from 'express';

export const validateLocation = (req: Request, res: Response, next: NextFunction) => {
  const { location } = req.body;

  if (
    !location ||
    location.type !== 'Point' ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2 ||
    typeof location.coordinates[0] !== 'number' ||
    typeof location.coordinates[1] !== 'number'
  ) {
    return res.status(400).json({ error: 'Ubicación inválida. Se espera GeoJSON Point [lng, lat].' });
  }

  next();
};
