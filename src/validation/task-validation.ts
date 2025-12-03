import { z, ZodType } from "zod";

export class TaskValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(191),
    desc: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(191).optional(),
    desc: z.string().optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    title: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    page: z.coerce.number().min(1),
    size: z.coerce.number().min(1)
  });
}

