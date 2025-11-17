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

describe("POST /api/login", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should be able to login", async () => {
    const response = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("test@example.com");
    expect(response.body.data.name).toBe("test");
  });

  it("Should rejected if email is incorrect", async () => {
    const response = await supertest(web).post("/api/login").send({
      email: "salah",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("Should rejected if password is incorrect", async () => {
    const response = await supertest(web).post("/api/login").send({
      email: "email@example.com",
      password: "salah",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("Should rejected if data is invalid", async () => {
    const response = await supertest(web).post("/api/login").send({
      email: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should be able to get current user", async () => {
    const token = TestUser.token();
    const response = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", `Bearer ${token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe("test@example.com");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.avatarUrl).toBeNull();
    expect(response.body.data.token).toBeUndefined();
    expect(new Date(response.body.data.updateAt)).toBeInstanceOf(Date);
    expect(new Date(response.body.data.createAt)).toBeInstanceOf(Date);
  });

  it("Should rejected if token is incorrect or not found", async () => {
    const token = TestUser.token() + "salah";
    const response = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", `Bearer ${token}`);

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
