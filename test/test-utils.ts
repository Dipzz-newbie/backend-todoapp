import { prismaClient } from "../src/app/database";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class TestUser {
  static token() {
    return jwt.sign(
      {
        id: "1",
        email: "test@example.com",
        name: "test",
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN! } as jwt.SignOptions
    );
  }
  static ErrToken() {
    return jwt.sign(
      {
        id: "2",
        email: "test@example.com",
        name: "test",
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN! } as jwt.SignOptions
    );
  }
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@example.com",
      },
    });
  }
  static async create() {
    await prismaClient.user.create({
      data: {
        email: "test@example.com",
        name: "test",
        password: await bcrypt.hash("test", 10),
        avatarUrl: null,
      },
    });
  }
}

export class TestTask {
  static async delete() {
    await prismaClient.task.delete({
      where: {
        email: "test@example.com",
      },
    });
  }
}
