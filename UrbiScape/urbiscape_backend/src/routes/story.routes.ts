import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  postStory, patchStory, getStories, getStory,
  postPublish, postUnpublish, postArchive, postDuplicate,
  getStoryMilestones
} from '../controllers/story.controller';

export const storyRouter = Router();

storyRouter.get('/', getStories);
storyRouter.get('/:idOrSlug', getStory);
storyRouter.get('/:id/milestones', getStoryMilestones);

const canEdit = requireRole('editor', 'admin');
storyRouter.post('/', requireAuth, canEdit, wrap(postStory));
storyRouter.patch('/:id', requireAuth, canEdit, wrap(patchStory));
storyRouter.post('/:id/publish', requireAuth, canEdit, wrap(postPublish));
storyRouter.post('/:id/unpublish', requireAuth, canEdit, wrap(postUnpublish));
storyRouter.post('/:id/archive', requireAuth, canEdit, wrap(postArchive));
storyRouter.post('/:id/duplicate', requireAuth, canEdit, wrap(postDuplicate));

function wrap(handler: any) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}
