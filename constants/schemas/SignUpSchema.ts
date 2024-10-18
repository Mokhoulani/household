import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Enter a valid email.'),
    name: z
      .string()
      .min(1, 'You need to enter a name.')
      .min(3, 'Name needs to be longer than 3 characters.'),
    password: z
      .string()
      .min(1, 'You need to enter a password.')
      .min(8, 'Password needs to be atleast 8 characters long.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type TsignUpSchema = z.infer<typeof signUpSchema>;
