import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { wrap } from '../utils/wrap.js';
import {
  postMilestone,
  patchMilestone,
  deleteMilestone,
  postReorderMilestones,
  getMilestone
} from '../controllers/milestone.controller.js';

export const milestoneRouter = Router();

// Público (si prefieres restringirlo, añade requireAuth o role aquí):
milestoneRouter.get('/:id', wrap(getMilestone));

const canEdit = requireRole('editor', 'admin');

milestoneRouter.post('/',        requireAuth, canEdit, wrap(postMilestone));
milestoneRouter.patch('/:id',    requireAuth, canEdit, wrap(patchMilestone));
milestoneRouter.delete('/:id',   requireAuth, canEdit, wrap(deleteMilestone));
milestoneRouter.post('/reorder', requireAuth, canEdit, wrap(postReorderMilestones));
