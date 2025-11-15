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
import { v4 as uuid } from "uuid";

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
      }
    });

    if(!user) {
      throw new ResponseError(401, "Password or email is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(userLogin.password, user.password);

    if(!isPasswordValid) {
      throw new ResponseError(401, "Password or email is incorrect");
    }

    user = await prismaClient.user.update({
      where: {
        email: userLogin.email,
      },
      data: {
        token: user.token ?? uuid(),
      }
    })
    
    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }
}
