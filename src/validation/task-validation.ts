import { z, ZodType } from "zod";

export class TaskValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(191),
    desc: z.string().min(1).max(191),
  });
}
