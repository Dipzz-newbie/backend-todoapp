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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../service/user-service");
const token_utils_1 = require("../utils/token-utils");
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield user_service_1.UserService.register(request);
                res.status(200).json({
                    data: response,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] || "unknown" });
                const response = yield user_service_1.UserService.login(request);
                res.status(200).json({
                    data: response,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield user_service_1.UserService.get(req.user);
                res.status(200).json({
                    data: response,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const request = req.body;
                const response = yield user_service_1.UserService.update(user, request);
                res.status(200).json({
                    data: response,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agent = req.headers["user-agent"] || "unknown";
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    throw new response_error_1.ResponseError(400, "Refresh token is required");
                }
                const tokenRecord = yield database_1.prismaClient.refreshToken.findFirst({
                    where: { token: refreshToken },
                });
                if (!tokenRecord) {
                    throw new response_error_1.ResponseError(401, "Invalid refresh token");
                }
                if (tokenRecord.expiresAt < new Date()) {
                    throw new response_error_1.ResponseError(401, "Refresh token has expired");
                }
                const user = yield database_1.prismaClient.user.findUnique({
                    where: { id: tokenRecord.userId },
                });
                if (!user) {
                    throw new response_error_1.ResponseError(404, "User not found");
                }
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                yield database_1.prismaClient.refreshToken.delete({
                    where: {
                        userId_userAgent: {
                            userId: user.id,
                            userAgent: agent
                        },
                        token: refreshToken
                    },
                });
                const newRefreshToken = (0, token_utils_1.generateRefreshToken)();
                yield database_1.prismaClient.refreshToken.create({
                    data: {
                        token: newRefreshToken,
                        userId: user.id,
                        userAgent: agent,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
                res.status(200).json({
                    data: {
                        token: accessToken,
                        refreshToken: newRefreshToken,
                    },
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = {
                    refreshToken: req.body.refreshToken,
                    userAgent: req.headers["user-agent"]
                };
                yield user_service_1.UserService.logout(request);
                res.status(200).json({
                    message: "Logout successfully"
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static uploadAvatar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    throw new response_error_1.ResponseError(400, "File not found");
                }
                const avatarUrl = `/uploads/avatars/${req.file.filename}`;
                const updated = yield database_1.prismaClient.user.update({
                    where: { id: req.user.id },
                    data: { avatarUrl },
                });
                res.status(200).json({
                    data: {
                        avatarUrl: updated.avatarUrl,
                    },
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.UserController = UserController;
