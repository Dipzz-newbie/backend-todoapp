import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";

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

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret, 
    {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions
  );

  const response = toUserResponse(user);
  response.token = token;
  return response;
}

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }
}
