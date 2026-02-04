import { z } from "zod";

export const movieSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  descEn: z.string().min(1, "English description is required"),
  descAr: z.string().min(1, "Arabic description is required"),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive(),
  posterImg: z
    .any()
    .refine((file) => file?.length === 1, "Poster image is required"),
  videoUrl: z
    .any()
    .refine((file) => file?.length === 1, "Video file is required"),
});
