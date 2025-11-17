import { prismaClient } from "../src/app/database";
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
        id: "1",
        email: "test@example.com",
        name: "test",
        password: await bcrypt.hash("test", 10),
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
