// updateMovieSchema.js
import { z } from 'zod';

export const updateMovieSchema = z.object({
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  descEn: z.string().min(1),
  descAr: z.string().min(1),
  price: z.number().positive(),

  posterImg: z.any().optional(),
  videoUrl: z.any().optional(),
});
