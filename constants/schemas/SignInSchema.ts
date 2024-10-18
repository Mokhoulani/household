import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'You need to enter a password.'),
});

export type TsignInSchema = z.infer<typeof signInSchema>;
