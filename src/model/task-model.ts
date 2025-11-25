import { Task } from "@prisma/client"


export type TaskResponse = {
    id: string;
    title: string;
    desc: string;
    complated: boolean;
    createdAt: Date | string;
    updateAt: Date | string | null;
}

export type CreateTaskRequest = {
    title: string,
    desc: string
}