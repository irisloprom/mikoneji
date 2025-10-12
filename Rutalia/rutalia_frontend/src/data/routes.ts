import { Milestone } from '../context/NavigationContext';

export const ROUTES: Record<string, Milestone[]> = {
  ruta0_beso_judas: [
    {
      id: 'ruta0_m1',
      title: 'Inicio - Sagrada Família',
      coordinates: [2.1744, 41.4036]
    },
    {
      id: 'ruta0_m2',
      title: 'Carrer de Provença',
      coordinates: [2.1677, 41.4018]
    },
    {
      id: 'ruta0_m3',
      title: 'Plaça de Catalunya',
      coordinates: [2.1700, 41.3870]
    }
  ]
};

export const DEFAULT_ROUTE_ID = 'ruta0_beso_judas';
