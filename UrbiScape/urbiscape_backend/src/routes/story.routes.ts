import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  postStory, patchStory, getStories, getStory,
  postPublish, postUnpublish, postArchive, postDuplicate,
  getStoryMilestones
} from '../controllers/story.controller.js';

export const storyRouter = Router();

// Lectura pública
storyRouter.get('/', getStories);
storyRouter.get('/:idOrSlug', getStory);
storyRouter.get('/:id/milestones', getStoryMilestones);

// Escritura (admin)
storyRouter.post('/', requireAuth, requireRole('admin'), wrap(postStory));
storyRouter.patch('/:id', requireAuth, requireRole('admin'), wrap(patchStory));
storyRouter.post('/:id/publish', requireAuth, requireRole('admin'), wrap(postPublish));
storyRouter.post('/:id/unpublish', requireAuth, requireRole('admin'), wrap(postUnpublish));
storyRouter.post('/:id/archive', requireAuth, requireRole('admin'), wrap(postArchive));
storyRouter.post('/:id/duplicate', requireAuth, requireRole('admin'), wrap(postDuplicate));

function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
