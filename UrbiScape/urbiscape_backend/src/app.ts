import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { storyRouter } from './routes/story.routes.js';
import { milestoneRouter } from './routes/milestone.routes.js';
import { attemptsRouter } from './routes/attempts.routes.js';
import { mediaRouter } from './routes/media.routes.js';



export const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: false })); // ajusta origin según tu frontend
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/stories', storyRouter);
app.use('/milestones', milestoneRouter);
app.use('/attempts', attemptsRouter);
app.use('/media', mediaRouter);




// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const msg = err?.message || 'Error interno';
  res.status(400).json({ error: msg });
});
