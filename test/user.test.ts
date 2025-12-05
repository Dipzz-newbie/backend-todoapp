import supertest from "supertest";
import { TestUser } from "./test-utils";
import { web } from "../src/app/web";
import { logger } from "../src/app/logging";
import { prismaClient } from "../src/app/database";

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
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
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

describe("POST /api/refresh-token", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should refresh token successfully", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });

    const token = login.body.data.token;
    const refresh_token = login.body.data.refreshToken;

    const response = await supertest(web)
      .post("/api/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken: refresh_token });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it("Should reject invalid refresh token", async () => {
    const response = await supertest(web)
      .post("/api/refresh-token")
      .send({ refreshToken: "invalid" });

    expect(response.status).toBe(401);
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should be able to get current user", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;

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

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("Should be able to update current user", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token;
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "new password",
        name: "test",
        avatarUrl: "http://example.com/avatar.png",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBeDefined();
  });

  it("Should be able to update user only password and name", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dipzz testing",
        password: "new password"
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Dipzz testing");
  });

  it("Should be able to update user only avatar url", async () => {
    const login = await supertest(web).post("/api/login").send({
      email: "test@example.com",
      password: "test",
    });
    const token = login.body.data.token
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({
        avatarUrl: "http://example.png"
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.avatarUrl).toBe("http://example.png");
  });

  it("Should rejected if token is invalid", async () => {
    const token = TestUser.token() + "salah";
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("POST /api/users/logout", () => {
  beforeEach(async () => {
    await TestUser.create();
  });

  afterEach(async () => {
    await TestUser.delete();
  });

  it("should logout successfully and delete the refresh token", async () => {
    const login = await supertest(web)
      .post("/api/login")
      .set("User-Agent", "jest-test-agent")
      .send({
        email: "test@example.com",
        password: "test"
      });

    expect(login.status).toBe(200);

    const accessToken = login.body.data.token;
    const refreshToken = login.body.data.refreshToken;

    const stored = await prismaClient.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userAgent: "jest-test-agent"
      }
    });

    expect(stored).not.toBeNull();


    const logoutResponse = await supertest(web)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("User-Agent", "jest-test-agent")
      .send({
        refreshToken: stored?.token,
        userAgent: "jest-test-agent"
      });

    logger.debug(logoutResponse.body);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Logout successfully");


    const checkAfter = await prismaClient.refreshToken.findFirst({
      where: {
        token: stored?.token
      }
    });

    expect(checkAfter).toBeNull();
  });

});
