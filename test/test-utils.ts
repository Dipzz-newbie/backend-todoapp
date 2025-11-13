import {prismaClient} from "../src/app/database"

export class TestUser{
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                email: "test@example.com"
            }
        })
    }
}