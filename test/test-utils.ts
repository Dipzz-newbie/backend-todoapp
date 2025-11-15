import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";

export class TestUser{
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                email: "test@example.com"
            }
        })
    }
    static async create() {
        await prismaClient.user.create({
            data: {
                email: "test@example.com",
                name: "test",
                password: await bcrypt.hash("test", 10),
                avatarUrl: null,
                token: "test",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
    }
}