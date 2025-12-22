"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user-controller");
exports.publicRouter = (0, express_1.default)();
exports.publicRouter.post("/api/register", user_controller_1.UserController.register);
exports.publicRouter.post("/api/login", user_controller_1.UserController.login);
exports.publicRouter.post("/api/refresh-token", user_controller_1.UserController.refreshToken);
exports.publicRouter.post("/api/users/logout", user_controller_1.UserController.logout);
