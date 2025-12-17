import { Task, User } from "@prisma/client";
import {
  CreateTaskRequest,
  SearchTaskRequest,
  TaskResponse,
  toTaskResponse,
  UpdateTaskRequest,
} from "../model/task-model";
import { TaskValidation } from "../validation/task-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { PageAble } from "../model/page-model";

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

    const data: any = {};

    if (payload.title !== undefined) {
      data.title = payload.title;
    }

    if (payload.desc !== undefined && payload.desc !== "") {
      data.desc = payload.desc;
    }

    if (payload.completed !== undefined) {
      data.completed = payload.completed;
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

  static async list(user: User): Promise<Array<TaskResponse>> {

    const checkUser = await prismaClient.task.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!checkUser) {
      throw new ResponseError(404, "Task is not found!")
    }

    const task = await prismaClient.task.findMany({
      where: {
        userId: user.id
      }
    });

    return task.map((tasks) => toTaskResponse(tasks));
  }

  static async search(user: User, request: SearchTaskRequest): Promise<PageAble<TaskResponse>> {
    const searchTask = await Validation.validate(TaskValidation.SEARCH, request);

    const skip = (searchTask.page - 1) * searchTask.size;

    let filters = [];

    if (searchTask.title) {
      filters.push({
        title: {
          contains: searchTask.title
        }
      })
    }

    if (searchTask.createdAt) {
      filters.push({
        createdAt: {
          gte: new Date(`${searchTask.createdAt}T00:00:00+07:00`),
          lt: new Date(`${searchTask.createdAt}T23:59:59+07:00`),
        }
      })
    }

    if (searchTask.updatedAt) {
      filters.push({
        updatedAt: {
          gte: new Date(`${searchTask.updatedAt}T00:00:00+07:00`),
          lt: new Date(`${searchTask.updatedAt}T23:59:59+07:00`)
        }
      })
    }

    const task = await prismaClient.task.findMany({
      where: {
        userId: user.id,
        AND: filters
      },
      take: searchTask.size,
      skip: skip
    });

    const total = await prismaClient.task.count({
      where: {
        userId: user.id,
        AND: filters
      }
    });

    return {
      data: task.map((tasks) => toTaskResponse(tasks)),
      paging: {
        current_page: searchTask.page,
        total_page: Math.ceil(total / searchTask.size),
        size: searchTask.size,
      }
    }

  }
}
