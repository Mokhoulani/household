import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Enter a valid email.'),
    name: z
      .string()
      .min(1, 'You must enter a name.')
      .min(3, 'Name must be longer than 3 characters.'),
    password: z
      .string()
      .min(1, 'You need to enter a password.')
      .min(8, 'Password must be atleast 8 characters long.')
      .superRefine((val, ctx) => {
        const issues: string[] = [];

        if (!/[A-ZÅÄÖ]/.test(val)) {
          issues.push('One uppercase letter');
        }
        if (!/[0-9]/.test(val)) {
          issues.push('One digit (0-9)');
        }
        if (/^[a-zÅÄÖA-ZÅÄÖ0-9]*$/.test(val)) {
          issues.push('One non-alphanumeric character');
        }
        if (issues.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Password must contain: ${issues.join('. ')}.`,
          });
        }
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type TsignUpSchema = z.infer<typeof signUpSchema>;
