import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v)),
});
