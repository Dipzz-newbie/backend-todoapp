import supertest from "supertest";
import { TestUser } from "./test-utils";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";

describe("POST /api/register", () => {
  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should create user", async () => {
    const res = await supertest(web).post("/api/register").send({
      email: "test@example.com",
      password: "test",
      name: "test",
    });

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.name).toBe("test");
  });

  it("Should reject invalid register body", async () => {
    const res = await supertest(web).post("/api/register").send({
      email: "",
      password: "",
      name: "",
    });
    logger.debug(res.body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/login", () => {
  beforeEach(async () => TestUser.create());
  afterEach(async () => TestUser.delete());

  it("Should login", async () => {
    const res = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    logger.debug(res.body);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("test@example.com");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("Should reject wrong email", async () => {
    const res = await supertest(web).post("/api/login").send({
      email: "salah",
      password: "test",
    });
    logger.debug(res.body);
    expect(res.status).toBe(401);
  });

  it("Should reject wrong password", async () => {
    const res = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "salah",
    });
    logger.debug(res.body);
    expect(res.status).toBe(401);
  });

  it("Should reject invalid body", async () => {
    const res = await supertest(web).post("/api/login").send({
      email: "",
      password: "",
    });

    logger.debug(res.body);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/refresh-token", () => {
  beforeEach(async () => TestUser.create());
  afterEach(async () => TestUser.delete());

  it("Should refresh access token", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    const refreshToken = login.body.data.refreshToken;

    const res = await supertest(web).post("/api/refresh-token").send({
      refreshToken,
    });

    logger.debug(res.body);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.token).toBeDefined();
  });

  it("Should reject invalid refresh token", async () => {
    const res = await supertest(web)
      .post("/api/refresh-token")
      .send({ refreshToken: "invalid" });
    logger.debug(res.body);
    expect(res.status).toBe(401);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => TestUser.create());
  afterEach(async () => TestUser.delete());

  it("Should get current user", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    const accessToken = login.body.data.accessToken;

    const res = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", `Bearer ${accessToken}`);

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("Should reject invalid token", async () => {
    const res = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "Bearer salah");

    logger.debug(res.body);
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => TestUser.create());
  afterEach(async () => TestUser.delete());

  it("Should update user profile", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    const accessToken = login.body.data.accessToken;

    const res = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        password: "baru",
        name: "New Name",
        avatarUrl: "http://example.com/avatar.png",
      });

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("New Name");
  });

  it("Should reject invalid token", async () => {
    const res = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "Bearer salah");

    logger.debug(res.body);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/users/logout", () => {
  beforeEach(async () => TestUser.create());
  afterEach(async () => TestUser.delete());

  it("Should logout and invalidate refresh token", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    const accessToken = login.body.data.accessToken;
    const refreshToken = login.body.data.refreshToken;

    const res = await supertest(web)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ refreshToken });

    logger.debug(res.body);
    expect(res.status).toBe(200);
  });

  it("Should reject logout with invalid access token", async () => {
    const res = await supertest(web)
      .post("/api/users/logout")
      .set("Authorization", "Bearer salah")
      .send({ refreshToken: "123" });

    logger.debug(res.body);
    expect(res.status).toBe(401);
  });
});
