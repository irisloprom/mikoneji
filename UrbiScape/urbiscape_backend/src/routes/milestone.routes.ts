import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  postMilestone,
  patchMilestone,
  deleteMilestone,
  postReorderMilestones,
  getMilestone
} from '../controllers/milestone.controller';

export const milestoneRouter = Router();

milestoneRouter.get('/:id', getMilestone);

const canEdit = requireRole('editor', 'admin');
milestoneRouter.post('/', requireAuth, canEdit, wrap(postMilestone));
milestoneRouter.patch('/:id', requireAuth, canEdit, wrap(patchMilestone));
milestoneRouter.delete('/:id', requireAuth, canEdit, wrap(deleteMilestone));
milestoneRouter.post('/reorder', requireAuth, canEdit, wrap(postReorderMilestones));

function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
