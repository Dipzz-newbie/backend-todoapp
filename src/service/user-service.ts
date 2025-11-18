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

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        email: userRegister.email,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "Email is already exist");
    }

    userRegister.password = await bcrypt.hash(userRegister.password, 10);

    const user = await prismaClient.user.create({
      data: userRegister,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const userLogin = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        email: userLogin.email,
      },
    });

    if (!user) {
      throw new ResponseError(401, "Password or email is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(
      userLogin.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "Password or email is incorrect");
    }

    const secret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret) {
      throw new ResponseError(500, "JWT secret is not defined");
    }

    if (!jwtExpiresIn) {
      throw new ResponseError(500, "JWT expires in is not defined");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: jwtExpiresIn,
      } as jwt.SignOptions
    );

    const refreshToken = generateRefreshToken();

    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })

    const response = toUserResponse(user);
    response.token = accessToken;
    return {
      ...response,
      refreshToken: refreshToken,
    } as any;
  }

  static async get(user: User): Promise<UserResponse> {
    const userGet = await prismaClient.user.findUnique({
      where: {
        id: user.id,
      },
    });

    return toUserResponse(userGet!);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const userUpdate = Validation.validate(UserValidation.UPDATE, request);

    if (userUpdate) {
      if (userUpdate.password) {
        userUpdate.password = await bcrypt.hash(userUpdate.password, 10);
      }

      if (userUpdate.name) {
        user.name = userUpdate.name;
      }

      if (userUpdate.avatarUrl) {
        user.avatarUrl = userUpdate.avatarUrl;
      }
    }

    const userExistsOnDatabase = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!userExistsOnDatabase) {
      throw new ResponseError(404, "User not found");
    }

    const result = await prismaClient.user.update({
      where: {
        email: user.email,
      },
      data: userUpdate,
    });

    return toUserResponse(result);
  }

}
