import { createApp } from "../src/app";
import { AppDataSource } from "../src/data-source";
import { Server } from "http";
import request from "supertest";

describe("App E2E Test", () => {
  let server: Server;

  beforeAll(async () => {
    server = createApp().listen(process.env.PORT || 4000, () => {
      console.log("Server Test Start.");
    });
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
    server.close();
  });

  describe("회원가입", () => {
    it("유저가 회원가입을 한다.", async () => {
      const { status, body } = await request(server)
        .post("/api/auth/signup")
        .send({ email: "test@test.com", password: "12345678" });

      expect(status).toBe(201);
      expect(body).toEqual({
        ok: true,
      });
    });
  });

  describe("로그인", () => {});
  describe("내 정보 조회", () => {});
  describe("투두리스트 CRUD", () => {});
});
