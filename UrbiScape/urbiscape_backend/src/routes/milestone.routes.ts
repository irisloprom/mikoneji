import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { postMilestone, getMilestone, patchMilestone, deleteMilestone, postReorderMilestones } from '../controllers/milestone.controller.js';

export const milestoneRouter = Router();

// Lectura individual (puedes protegerla si lo prefieres)
milestoneRouter.get('/:id', getMilestone);

// CRUD (admin)
milestoneRouter.post('/', requireAuth, requireRole('admin'), wrap(postMilestone));
milestoneRouter.patch('/:id', requireAuth, requireRole('admin'), wrap(patchMilestone));
milestoneRouter.delete('/:id', requireAuth, requireRole('admin'), wrap(deleteMilestone));
milestoneRouter.post('/reorder', requireAuth, requireRole('admin'), wrap(postReorderMilestones));

function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
