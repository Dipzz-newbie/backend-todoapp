import { User } from "@prisma/client";


export type UserResponse = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date | string;
    updateAt: Date | string | null;
    token?: string;
    refreshToken?: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type CreateUserRequest = {
    email: string;
    password: string;
    name: string;
}

export type UpdateUserRequest = {
    password?: string;
    name?: string;
    avatarUrl?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        updateAt: user.updatedAt,
        createdAt: user.createdAt,
    }
}
