import { Task, User } from "@prisma/client";
import { CreateTaskRequest, TaskResponse, toTaskResponse, UpdateTaskRequest } from "../model/task-model";
import { TaskValidation } from "../validation/task-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";


export class TaskService {
    static async create(user:User, request: CreateTaskRequest): Promise<TaskResponse> {
        const taskCreate = Validation.validate(TaskValidation.CREATE, request);

        if(!taskCreate) {
            throw new ResponseError(400, "Text is required")
        }

        const record = {
            ...taskCreate,
            ...{userId: user.id}
        }

        const task = await prismaClient.task.create({
            data: record
        })

        return toTaskResponse(task);
        
    }

    static async CheckTaskMustExist(userId: string, id:string): Promise<Task> {
        const task = await prismaClient.task.findUnique({
            where:  {
                id: id,
                userId: userId
            }
        });

        if(!task) {
            throw new ResponseError(404, "Task is not found!")
        };

        return task;
    }

    static async update(user: User, request:UpdateTaskRequest): Promise<TaskResponse>{
        const taskUpdate = Validation.validate(TaskValidation.UPDATE, request);
        await this.CheckTaskMustExist(user.id, taskUpdate.id);

        const task = await prismaClient.task.update({
            where: {
                id: taskUpdate.id,
                userId: user.id
            },
            data: taskUpdate
        });

        return toTaskResponse(task);
    }
}