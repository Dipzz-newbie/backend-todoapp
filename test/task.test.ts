import supertest from "supertest";
import { TestTask, TestUser } from "./test-utils";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";

describe("POST /api/users/tasks", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestTask.delete();
    await TestUser.delete();
  });

  it("Should be able to create new task", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;

    const response = await supertest(web)
      .post("/api/users/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "membuat project",
        desc: "harus commit dalam membuat aplikasi tersebut",
      });

    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("Should rejected if data is invalid", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;

    const response = await supertest(web)
      .post("/api/users/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/tasks/taskId", () => {
  beforeEach(async () => {
    await TestTask.create();
  });

  afterEach(async () => {
    await TestTask.delete();
    await TestUser.delete();
  });

  it("Should be able to update task", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;

    const task = await TestTask.get();

    const response = await supertest(web)
      .patch(`/api/users/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "judul baru",
        desc: "desc baru",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("judul baru");
    expect(response.body.data.desc).toBe("desc baru");
  });
  
  it("Should be able to update task", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;

    const task = await TestTask.get();

    const response = await supertest(web)
      .patch(`/api/users/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "judul baru",
        desc: "desc baru",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("judul baru");
    expect(response.body.data.desc).toBe("desc baru");
  });
});
