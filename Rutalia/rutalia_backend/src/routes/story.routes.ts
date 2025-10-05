import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { wrap } from '../utils/wrap.js';
import {
  postStory, patchStory, getStories, getStory, postPublish, postUnpublish, postArchive, postDuplicate, getStoryMilestones, getStoryFull
} from '../controllers/story.controller.js';

export const storyRouter = Router();

storyRouter.get('/', wrap(getStories));

// ⚠️ RUTA MÁS ESPECÍFICA ANTES que la genérica
storyRouter.get('/:id/milestones', wrap(getStoryMilestones));
storyRouter.get('/:idOrSlug/full', wrap(getStoryFull));
storyRouter.get('/:idOrSlug', wrap(getStory));

const canEdit = requireRole('editor', 'admin');
storyRouter.post('/', requireAuth, canEdit, wrap(postStory));
storyRouter.patch('/:id', requireAuth, canEdit, wrap(patchStory));
storyRouter.post('/:id/publish', requireAuth, canEdit, wrap(postPublish));
storyRouter.post('/:id/unpublish', requireAuth, canEdit, wrap(postUnpublish));
storyRouter.post('/:id/archive', requireAuth, canEdit, wrap(postArchive));
storyRouter.post('/:id/duplicate', requireAuth, canEdit, wrap(postDuplicate));