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
exports.UserService = void 0;
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
const user_model_1 = require("../model/user-model");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_utils_1 = require("../utils/token-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRegister = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const existingUser = yield database_1.prismaClient.user.count({
                where: { email: userRegister.email },
            });
            if (existingUser !== 0) {
                throw new response_error_1.ResponseError(400, "Email already exists");
            }
            userRegister.password = yield bcrypt_1.default.hash(userRegister.password, 10);
            const user = yield database_1.prismaClient.user.create({
                data: userRegister,
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginData = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            const user = yield database_1.prismaClient.user.findUnique({
                where: { email: loginData.email },
            });
            if (!user) {
                throw new response_error_1.ResponseError(401, "Email or password is incorrect");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(loginData.password, user.password);
            if (!isPasswordValid) {
                throw new response_error_1.ResponseError(401, "Email or password is incorrect");
            }
            const secret = process.env.JWT_SECRET;
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
            if (!secret)
                throw new response_error_1.ResponseError(500, "JWT secret is not defined");
            if (!jwtExpiresIn)
                throw new response_error_1.ResponseError(500, "JWT expiresIn is not defined");
            const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secret, {
                expiresIn: jwtExpiresIn,
            });
            const refreshToken = (0, token_utils_1.generateRefreshToken)();
            const agent = request.userAgent;
            const existing = yield database_1.prismaClient.refreshToken.findFirst({
                where: {
                    userId: user.id,
                    userAgent: agent
                }
            });
            if (existing) {
                yield database_1.prismaClient.refreshToken.update({
                    where: {
                        userId_userAgent: {
                            userId: user.id,
                            userAgent: agent
                        }
                    },
                    data: {
                        token: refreshToken
                    }
                });
            }
            else {
                yield database_1.prismaClient.refreshToken.create({
                    data: {
                        token: refreshToken,
                        userId: user.id,
                        userAgent: agent,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            }
            const response = (0, user_model_1.toUserResponse)(user);
            response.token = accessToken;
            return Object.assign(Object.assign({}, response), { refreshToken: refreshToken });
        });
    }
    static get(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGet = yield database_1.prismaClient.user.findUnique({
                where: { id: user.id },
            });
            return (0, user_model_1.toUserResponse)(userGet);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUpdate = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, request);
            const data = {};
            if (userUpdate.password !== undefined) {
                data.password = yield bcrypt_1.default.hash(userUpdate.password, 10);
            }
            if (userUpdate.name !== undefined) {
                data.name = userUpdate.name;
            }
            if (userUpdate.avatarUrl !== undefined) {
                if (user.avatarUrl) {
                    const oldPath = path_1.default.join(process.cwd(), user.avatarUrl);
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlinkSync(oldPath);
                    }
                }
                data.avatarUrl = userUpdate.avatarUrl;
            }
            const updated = yield database_1.prismaClient.user.update({
                where: { id: user.id },
                data,
            });
            return (0, user_model_1.toUserResponse)(updated);
        });
    }
    static logout(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield database_1.prismaClient.refreshToken.findFirst({
                where: {
                    userAgent: request.userAgent,
                    token: request.refreshToken,
                }
            });
            if (!existing) {
                throw new response_error_1.ResponseError(404, "Refresh token not found");
            }
            yield database_1.prismaClient.refreshToken.delete({
                where: {
                    id: existing.id
                }
            });
            return true;
        });
    }
    static updateAvatar(user, avatarFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarUrl = `/uploads/avatars/${avatarFilename}`;
            const updatedUser = yield database_1.prismaClient.user.update({
                where: { id: user.id },
                data: { avatarUrl },
            });
            return { avatarUrl: updatedUser.avatarUrl };
        });
    }
}
exports.UserService = UserService;
