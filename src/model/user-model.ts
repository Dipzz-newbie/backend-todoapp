

export type UserResponse = {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createAt: Date;
    updateAt: Date;
    token?: string;
}

export type CreateUserRequest = {
    email: string;
    name: string;
    password: string;
}
