import { User } from "@prisma/client";


export type UserResponse = {
    id?: string;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    cratedAt?: Date;
    updateAt?: Date;
    token?: string;
}

export type CreateUserRequest = {
    email: string;
    password: string;
    name: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        email: user.email,
    }
}
