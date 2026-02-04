import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username too short"),
  email: z.string().email(),
  password: z.string().min(6),
  imgProfile: z.any().optional()
});
