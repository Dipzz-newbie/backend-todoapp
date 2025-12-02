import { prismaClient } from "../src/app/database";
import { Task, User } from "@prisma/client";
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

  static userDummyId: string;
  static userDummyEmail: string;

  static async delete() {
    await prismaClient.task.deleteMany({
      where: {
        userId: this.userDummyId,
      },
    });
  }

  static async create() {

    const userDummy = await prismaClient.user.create({
      data: {
        id: "1",
        email: "test@example.com",
        name: "test",
        password: await bcrypt.hash("test", 10),
        avatarUrl: null,
      },
    });

    this.userDummyEmail = userDummy.email;
    this.userDummyId = userDummy.id;

    await prismaClient.task.create({
      data: {
        title: "test title",
        desc: "test desc",
        userId: this.userDummyId,
      },
    });

  }

  static async get(): Promise<Task> {
    const tasks = await prismaClient.task.findFirst({
      where: {
        userId: this.userDummyId,
      },
    });

    if (!tasks) {
      throw new Error("task is not found!");
    }

    return tasks;
  }

  static async expToken() {
    const expiredToken = jwt.sign(
      {
        id: this.userDummyId,
        email: this.userDummyEmail,
        exp: Math.floor(Date.now() / 1000) - 10,
      },
      process.env.JWT_SECRET!
    );

    return expiredToken
  }

  static async createManyTask() {
  const contacts = Array.from({ length: 15 }, (_, i) => ({
    title: `test ${i}`,
    desc: `test ${i}`,
    userId: this.userDummyId
  }));

  await prismaClient.task.createMany({
    data: contacts,
    skipDuplicates: true
  });
}
}
