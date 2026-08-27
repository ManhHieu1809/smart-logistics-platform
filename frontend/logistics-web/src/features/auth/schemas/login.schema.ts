import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Email or username is required'),

  password: z
    .string()
    .min(1, 'Password is required'),

  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;