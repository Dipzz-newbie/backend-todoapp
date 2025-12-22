"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    email: zod_1.z.string().min(1).max(191),
    password: zod_1.z.string().min(1).max(191),
    name: zod_1.z.string().min(1).max(191),
});
UserValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().min(1).max(191),
    password: zod_1.z.string().min(1).max(191),
});
UserValidation.UPDATE = zod_1.z.object({
    password: zod_1.z.string().max(191).optional(),
    name: zod_1.z.string().max(191).optional(),
    avatarUrl: zod_1.z.string().max(191).optional(),
});
