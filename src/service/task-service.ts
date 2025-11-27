import { User } from "@prisma/client";
import { CreateTaskRequest, TaskResponse, toTaskResponse } from "../model/task-model";
import { TaskValidation } from "../validation/task-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";


export class TaskService {
    static async create(user:User, request: CreateTaskRequest): Promise<TaskResponse> {
        const taskCreate = Validation.validate(TaskValidation.CREATE, request);

        const record = {
            ...taskCreate,
            ...{userId: user.id}
        }

        const task = await prismaClient.task.create({
            data: record
        })

        return toTaskResponse(task);
        
    }
}