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
    name: z.string().min(1).max(191),
    avatarUrl: z.string().min(1).max(191).optional(),
  });
}

