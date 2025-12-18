import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    email: z.string().min(1).max(191),
    password: z.string().min(1).max(191),
    name: z.string().min(1).max(191),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(191),
    password: z.string().min(1).max(191),
  })

  static readonly UPDATE: ZodType = z.object({
    password: z.string().max(191).optional(),
    name: z.string().max(191).optional(),
    avatarUrl: z.string().max(191).optional(),
  });
}

