import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

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

    userRegister.password = bcrypt.hash(userRegister.password, 10);

    const user = await prismaClient.user.create({
      data: userRegister,
    });

    return toUserResponse(user);
  }
}
