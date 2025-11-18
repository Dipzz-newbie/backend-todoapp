import { Response, Request, NextFunction } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import { UserRequest } from "../type/user-request";
import { generateRefreshToken } from "../utils/token-utils";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import jwt from "jsonwebtoken";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const response = await UserService.login(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(user, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new ResponseError(400, "Refresh token is required");
      }

      const tokenRecord = await prismaClient.refreshToken.findUnique({
        where: { token: refresh_token },
      });

      if (!tokenRecord) {
        throw new ResponseError(401, "Invalid refresh token");
      }

      if (tokenRecord.expiresAt < new Date()) {
        throw new ResponseError(401, "Refresh token has expired");
      }

      const user = await prismaClient.user.findUnique({
        where: { id: tokenRecord.userId },
      });

      if (!user) {
        throw new ResponseError(404, "User not found");
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN! } as jwt.SignOptions
      );

      await prismaClient.refreshToken.delete({
        where: { token: refresh_token },
      });

      const newRefreshToken = generateRefreshToken();

      await prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.status(200).json({
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const user = req.user!;

      await UserService.logout(user, refreshToken);

      res.status(200).json({
        data: {
          message: "Successfully logged out",
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
