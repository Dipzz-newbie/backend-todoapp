import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { CreateTaskRequest, UpdateTaskRequest } from "../model/task-model";
import { TaskService } from "../service/task-service";

export class TaskController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateTaskRequest = req.body;
      const user = req.user!;
      const response = await TaskService.create(user, request);

      return res.status(200).json({ data: response });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const response = await TaskService.get(req.user!, taskId);

      return res.status(200).json({ data: response });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateTaskRequest = {
        id: req.params.taskId,
        title: req.body.title,
        desc: req.body.desc,
      };

      const response = await TaskService.update(req.user!, request);

      return res.status(200).json({ data: response });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      await TaskService.remove(req.user!, taskId);

      return res.status(200).json({
        data: { message: "data berhasil di hapus!" },
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try{
      const taskId = req.params.taskId;
      const response = await TaskService.list(req.user!, taskId);
      res.status(200).json({
        data: response
      })
    }catch(e) {
      next(e)
    }
  }
}
