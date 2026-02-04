import express from 'express';
import {
  createMovie,
  getAllMovies,
  getSingleMovie,
  deleteMovie,
  updateMovie
} from '../controllers/movie.js';
import { protect, adminOnly } from '../middleware/auth.js';
import uploadMovie from '../middleware/uploadMovie.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getSingleMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

router.put(
  '/:id',
  protect,
  adminOnly,
  uploadMovie.fields([
    { name: 'posterImg', maxCount: 1 },
    { name: 'videoUrl', maxCount: 1 },
  ]),
  updateMovie
);

router.post(
  '/',
  protect,
  adminOnly,
  uploadMovie.fields([
    { name: 'posterImg', maxCount: 1 },
    { name: 'videoUrl', maxCount: 1 },
  ]),
  createMovie
);

export default router;
