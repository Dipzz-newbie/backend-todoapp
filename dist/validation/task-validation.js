"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = require("zod");
class TaskValidation {
}
exports.TaskValidation = TaskValidation;
TaskValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(191),
    desc: zod_1.z.string().optional(),
});
TaskValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(191).optional(),
    desc: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().optional()
});
TaskValidation.SEARCH = zod_1.z.object({
    title: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1),
    size: zod_1.z.coerce.number().min(1)
});
