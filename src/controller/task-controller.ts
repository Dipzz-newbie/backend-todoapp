import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { CreateTaskRequest, UpdateTaskRequest } from "../model/task-model";
import { TaskService } from "../service/task-service";

export class TaskController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateTaskRequest = req.body as CreateTaskRequest;
      const user = req.user!;
      const response = await TaskService.create(user, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateTaskRequest = req.body as UpdateTaskRequest;
      request.id = Number(req.params.taskId);
      const user = req.user!;
      const response = await TaskService.update(user, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
