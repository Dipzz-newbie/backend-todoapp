import { Task } from "@prisma/client"


export type TaskResponse = {
    id: string;
    title: string;
    desc: string;
    completed: boolean;
    createdAt: Date | string;
    updatedAt: Date | string | null;
}

export type CreateTaskRequest = {
    title: string,
    desc: string
}

export type UpdateTaskRequest = {
    id: number,
    title?: string,
    desc?: string
}

export function toTaskResponse(task: Task): TaskResponse {
    return{
        id: task.id,
        title: task.title,
        desc: task.title,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }
}