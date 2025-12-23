"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const task_controller_1 = require("../controller/task-controller");
const upload_middleware_1 = require("../middleware/upload-middleware");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use(auth_middleware_1.authMiddleware);
// api User routes
exports.apiRouter.get("/api/users/current", user_controller_1.UserController.get);
exports.apiRouter.patch("/api/users/current", user_controller_1.UserController.update);
exports.apiRouter.post("/api/users/avatar", upload_middleware_1.uploadAvatar.single("avatar"), user_controller_1.UserController.uploadAvatar);
exports.apiRouter.delete("/api/users/avatar", user_controller_1.UserController.removeAvatar);
//api Task routes
exports.apiRouter.post("/api/users/tasks", task_controller_1.TaskController.create);
exports.apiRouter.patch("/api/users/tasks/:taskId", task_controller_1.TaskController.update);
exports.apiRouter.delete("/api/users/tasks/:taskId", task_controller_1.TaskController.remove);
exports.apiRouter.get("/api/users/tasks/search", task_controller_1.TaskController.search);
exports.apiRouter.get("/api/users/tasks/:taskId", task_controller_1.TaskController.get);
exports.apiRouter.get("/api/users/tasks", task_controller_1.TaskController.list);
