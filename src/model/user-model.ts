import { User } from "@prisma/client";


export type UserResponse = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null
    token?: string;
}

export type CreateUserRequest = {
    email: string;
    password: string;
    name: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
    }
}
