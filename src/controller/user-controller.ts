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
import { supabase } from "../lib/supabase";
import path from "path"
import { logger } from "../app/logging";

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
      const request: LoginUserRequest = {
        ...req.body,
        userAgent: req.headers["user-agent"] || "unknown"
      };
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
      const agent = req.headers["user-agent"] || "unknown"
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ResponseError(400, "Refresh token is required");
      }

      const tokenRecord = await prismaClient.refreshToken.findFirst({
        where: { token: refreshToken },
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
        where: {
          userId_userAgent: {
            userId: user.id,
            userAgent: agent
          },
          token: refreshToken
        },
      });

      const newRefreshToken = generateRefreshToken();

      await prismaClient.refreshToken.create({
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
    } catch (e) {
      next(e);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {

      const request: any = {
        refreshToken: req.body.refreshToken,
        userAgent: req.headers["user-agent"]
      };

      await UserService.logout(request);

      res.status(200).json({
        message: "Logout successfully"
      });

    } catch (e) {
      next(e);
    }
  }

  static async uploadAvatar(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new ResponseError(400, "File not found");

      const user = req.user!;
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      if (user.avatarUrl) {
        const oldPath = user.avatarUrl.split("/avatars/")[1];
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) throw new ResponseError(500, uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = publicUrlData.publicUrl;

      const updated = await prismaClient.user.update({
        where: { id: user.id },
        data: { avatarUrl },
      });

      res.status(200).json({ data: { avatarUrl: updated.avatarUrl } });
    } catch (e) {
      next(e);
    }
  }






}
