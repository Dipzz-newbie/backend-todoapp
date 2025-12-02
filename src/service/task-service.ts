import { Task, User } from "@prisma/client";
import {
  CreateTaskRequest,
  TaskResponse,
  toTaskResponse,
  UpdateTaskRequest,
} from "../model/task-model";
import { TaskValidation } from "../validation/task-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class TaskService {
  static async create(
    user: User,
    request: CreateTaskRequest
  ): Promise<TaskResponse> {
    const taskCreate = Validation.validate(TaskValidation.CREATE, request);

    const task = await prismaClient.task.create({
      data: {
        title: taskCreate.title,
        desc: taskCreate.desc,
        userId: user.id,
      },
    });

    return toTaskResponse(task);
  }

  static async checkTask(userId: string, taskId: string): Promise<Task> {
    const task = await prismaClient.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    if (!task) {
      throw new ResponseError(404, "Task not found");
    }

    return task;
  }

  static async get(user: User, id: string): Promise<TaskResponse> {
    const task = await this.checkTask(user.id, id);
    return toTaskResponse(task);
  }

  static async update(
    user: User,
    request: UpdateTaskRequest
  ): Promise<TaskResponse> {
    const payload = Validation.validate(TaskValidation.UPDATE, request);

    const existing = await this.checkTask(user.id, payload.id);

    const data: any = {
      title: payload.title,
      desc: payload.desc,
    };

    if (payload.desc !== undefined && payload.desc !== "") {
      data.desc = payload.desc;
    }


    const updated = await prismaClient.task.update({
      where: { id: existing.id },
      data,
    });

    return toTaskResponse(updated);
  }

  static async remove(user: User, id: string): Promise<TaskResponse> {
    const existing = await this.checkTask(user.id, id);

    const deleted = await prismaClient.task.delete({
      where: { id: existing.id },
    });

    return toTaskResponse(deleted);
  }
}
