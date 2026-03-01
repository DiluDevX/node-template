import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim(),
  description: z.string().max(500, 'Description is too long').trim().optional(),
});

export const updateItemSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim().optional(),
    description: z.string().max(500, 'Description is too long').trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
