"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_model_1 = require("../model/task-model");
const task_validation_1 = require("../validation/task-validation");
const validation_1 = require("../validation/validation");
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
class TaskService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskCreate = validation_1.Validation.validate(task_validation_1.TaskValidation.CREATE, request);
            const task = yield database_1.prismaClient.task.create({
                data: {
                    title: taskCreate.title,
                    desc: taskCreate.desc,
                    userId: user.id,
                },
            });
            return (0, task_model_1.toTaskResponse)(task);
        });
    }
    static checkTask(userId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield database_1.prismaClient.task.findFirst({
                where: {
                    id: taskId,
                    userId: userId,
                },
            });
            if (!task) {
                throw new response_error_1.ResponseError(404, "Task not found");
            }
            return task;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.checkTask(user.id, id);
            return (0, task_model_1.toTaskResponse)(task);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = validation_1.Validation.validate(task_validation_1.TaskValidation.UPDATE, request);
            const existing = yield this.checkTask(user.id, payload.id);
            const data = {};
            if (payload.title !== undefined) {
                data.title = payload.title;
            }
            if (payload.desc !== undefined && payload.desc !== "") {
                data.desc = payload.desc;
            }
            if (payload.completed !== undefined) {
                data.completed = payload.completed;
            }
            const updated = yield database_1.prismaClient.task.update({
                where: { id: existing.id },
                data,
            });
            return (0, task_model_1.toTaskResponse)(updated);
        });
    }
    static remove(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.checkTask(user.id, id);
            const deleted = yield database_1.prismaClient.task.delete({
                where: { id: existing.id },
            });
            return (0, task_model_1.toTaskResponse)(deleted);
        });
    }
    static list(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield database_1.prismaClient.task.findFirst({
                where: {
                    userId: user.id
                }
            });
            if (!checkUser) {
                throw new response_error_1.ResponseError(404, "Task is not found!");
            }
            const task = yield database_1.prismaClient.task.findMany({
                where: {
                    userId: user.id
                }
            });
            return task.map((tasks) => (0, task_model_1.toTaskResponse)(tasks));
        });
    }
    static search(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTask = yield validation_1.Validation.validate(task_validation_1.TaskValidation.SEARCH, request);
            const skip = (searchTask.page - 1) * searchTask.size;
            let filters = [];
            if (searchTask.title) {
                filters.push({
                    title: {
                        contains: searchTask.title
                    }
                });
            }
            if (searchTask.createdAt) {
                filters.push({
                    createdAt: {
                        gte: new Date(`${searchTask.createdAt}T00:00:00+07:00`),
                        lt: new Date(`${searchTask.createdAt}T23:59:59+07:00`),
                    }
                });
            }
            if (searchTask.updatedAt) {
                filters.push({
                    updatedAt: {
                        gte: new Date(`${searchTask.updatedAt}T00:00:00+07:00`),
                        lt: new Date(`${searchTask.updatedAt}T23:59:59+07:00`)
                    }
                });
            }
            const task = yield database_1.prismaClient.task.findMany({
                where: {
                    userId: user.id,
                    AND: filters
                },
                take: searchTask.size,
                skip: skip
            });
            const total = yield database_1.prismaClient.task.count({
                where: {
                    userId: user.id,
                    AND: filters
                }
            });
            return {
                data: task.map((tasks) => (0, task_model_1.toTaskResponse)(tasks)),
                paging: {
                    current_page: searchTask.page,
                    total_page: Math.ceil(total / searchTask.size),
                    size: searchTask.size,
                }
            };
        });
    }
}
exports.TaskService = TaskService;
