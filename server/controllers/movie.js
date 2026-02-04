import Movie from '../models/movie.js';
import fs from 'fs/promises';
import path from 'path';

// Clean, reusable async file deletion
const deleteFile = async (filePath) => {
  if (!filePath) return;
  try {
    const absolutePath = path.resolve(filePath);
    await fs.unlink(absolutePath);
  } catch (err) {
    console.error(`Cleanup error: ${filePath}`, err.message);
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const lang = req.query.lang === 'ar' ? 'ar' : 'en';
    const movies = await Movie.find().lean();

    const formattedMovies = movies.map((m) => ({
      _id: m._id,
      title: m.title?.[lang] || m.title?.en,
      desc: m.desc?.[lang] || m.desc?.en,
      posterImg: m.posterImg,
      videoUrl: m.videoUrl,
      price: m.price,
      rating: m.rating,
      createdAt: m.createdAt,
    }));

    res.status(200).json(formattedMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang === 'ar' ? 'ar' : 'en';

    const movie = await Movie.findById(id)
      .populate('createdBy', 'username')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username imgProfile' },
      })
      .lean();

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.status(200).json({
      ...movie,
      title: movie.title?.[lang] || movie.title?.en,
      desc: movie.desc?.[lang] || movie.desc?.en,
      rating: movie.rating || 0,
    });
  } catch (error) {
    const status = error.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({
      title: { en: req.body['title.en'], ar: req.body['title.ar'] },
      desc: { en: req.body['desc.en'], ar: req.body['desc.ar'] },
      price: Number(req.body.price),
      posterImg: req.files?.posterImg?.[0]?.path.replace(/\\/g, '/'),
      videoUrl: req.files?.videoUrl?.[0]?.path.replace(/\\/g, '/'),
      createdBy: req.user.id,
    });

    res.status(201).json(movie);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).flat().forEach(f => deleteFile(f.path));
    }
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const updateData = {
      'title.en': req.body['title.en'] ?? movie.title.en,
      'title.ar': req.body['title.ar'] ?? movie.title.ar,
      'desc.en': req.body['desc.en'] ?? movie.desc.en,
      'desc.ar': req.body['desc.ar'] ?? movie.desc.ar,
      price: req.body.price ?? movie.price,
    };

    if (req.files?.posterImg?.[0]) {
      await deleteFile(movie.posterImg);
      updateData.posterImg = req.files.posterImg[0].path.replace(/\\/g, '/');
    }

    if (req.files?.videoUrl?.[0]) {
      await deleteFile(movie.videoUrl);
      updateData.videoUrl = req.files.videoUrl[0].path.replace(/\\/g, '/');
    }

    const updated = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    await Promise.all([deleteFile(movie.posterImg), deleteFile(movie.videoUrl)]);
    await movie.deleteOne();

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};