import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { CreateTaskRequest, SearchTaskRequest, UpdateTaskRequest } from "../model/task-model";
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
        completed: req.body.completed
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
      const response = await TaskService.list(req.user!);
      res.status(200).json({
        data: response
      })
    }catch(e) {
      next(e)
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try{
      const request: SearchTaskRequest = {
        title: req.query.title ? String(req.query.title) : undefined,
        createdAt: req.query.createdAt ? String(req.query.createAt) : undefined,
        updatedAt: req.query.updatedAt ? String(req.query.updateAt): undefined,
        page: req.query.page ? Number(req.query.page): 1,
        size: req.query.size ? Number(req.query.size): 10,
      }
      const response = await TaskService.search(req.user!, request);
      res.status(200).json(response)
    }catch(e) {
      next(e)
    }
  }
}
