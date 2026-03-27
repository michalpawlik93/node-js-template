import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  priceCents: z.coerce.number().int().min(1, 'Price must be at least 1'),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
