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
exports.TaskController = void 0;
const task_service_1 = require("../service/task-service");
class TaskController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const user = req.user;
                const response = yield task_service_1.TaskService.create(user, request);
                return res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.taskId;
                const response = yield task_service_1.TaskService.get(req.user, taskId);
                return res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = {
                    id: req.params.taskId,
                    title: req.body.title,
                    desc: req.body.desc,
                    completed: req.body.completed
                };
                const response = yield task_service_1.TaskService.update(req.user, request);
                return res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.taskId;
                yield task_service_1.TaskService.remove(req.user, taskId);
                return res.status(200).json({
                    data: { message: "data berhasil di hapus!" },
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield task_service_1.TaskService.list(req.user);
                res.status(200).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = {
                    title: req.query.title ? String(req.query.title) : undefined,
                    createdAt: req.query.createdAt ? String(req.query.createAt) : undefined,
                    updatedAt: req.query.updatedAt ? String(req.query.updateAt) : undefined,
                    page: req.query.page ? Number(req.query.page) : 1,
                    size: req.query.size ? Number(req.query.size) : 10,
                };
                const response = yield task_service_1.TaskService.search(req.user, request);
                res.status(200).json(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.TaskController = TaskController;
