import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../utils/token-utils";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const userRegister = Validation.validate(UserValidation.REGISTER, request);

    const existingUser = await prismaClient.user.count({
      where: { email: userRegister.email },
    });

    if (existingUser !== 0) {
      throw new ResponseError(400, "Email already exists");
    }

    userRegister.password = await bcrypt.hash(userRegister.password, 10);

    const user = await prismaClient.user.create({
      data: userRegister,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginData = Validation.validate(UserValidation.LOGIN, request);

    const user = await prismaClient.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new ResponseError(401, "Email or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "Email or password is incorrect");
    }

    const secret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret) throw new ResponseError(500, "JWT secret is not defined");
    if (!jwtExpiresIn)
      throw new ResponseError(500, "JWT expiresIn is not defined");

    const accessToken = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = generateRefreshToken();

    const agent = request.userAgent;

    const existing = await prismaClient.refreshToken.findFirst({
      where: {
        userId: user.id,
        userAgent: agent
      }
    });

    if (existing) {
      await prismaClient.refreshToken.update({
        where: {
          userId_userAgent: {
            userId: user.id,
            userAgent: agent
          }
        },
        data: {
          token: refreshToken
        }
      })
    } else {
      await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          userAgent: agent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const response = toUserResponse(user);
    response.token = accessToken;

    return {
      ...response,
      refreshToken: refreshToken,
    };
  }

  static async get(user: User): Promise<UserResponse> {
    const userGet = await prismaClient.user.findUnique({
      where: { id: user.id },
    });

    return toUserResponse(userGet!);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const userUpdate = Validation.validate(UserValidation.UPDATE, request);

    const data: any = {};

    if (userUpdate.password) {
      data.password = await bcrypt.hash(userUpdate.password, 10);
    }
    if (userUpdate.name) data.name = userUpdate.name;
    if (userUpdate.avatarUrl) data.avatarUrl = userUpdate.avatarUrl;

    const updated = await prismaClient.user.update({
      where: { id: user.id },
      data,
    });

    return toUserResponse(updated);
  }

  static async logout(user: User) {
    const existing = await prismaClient.refreshToken.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!existing) {
      throw new ResponseError(401, "Invalid or expired refresh token");
    }

    await prismaClient.refreshToken.delete({
      where: { token: existing.token },
    });
  }
}
