import supertest from "supertest";
import { TestUser } from "./test-utils";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";

describe("POST /api/register", () => {
  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should be able to create user", async () => {
    const response = await supertest(web).post("/api/register").send({
      email: "test@example.com",
      password: "test123",
      name: "test",
    });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("test@example.com");
    expect(response.body.data.name).toBe("test");
  });

  it("Should rejected if data is invalid", async () => {
    const response = await supertest(web).post("/api/register").send({
      email: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
