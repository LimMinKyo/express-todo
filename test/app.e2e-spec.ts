import { createApp } from "../src/app";
import { AppDataSource } from "../src/data-source";
import { Server } from "http";
import request from "supertest";
import User from "../src/entities/user.entity";
import { TodoDto } from "../src/dtos/todos/common/todo.dto";
import Todo from "../src/entities/todo.entity";

const TOKEN_KEY = "token";

const testUser = { email: "test@test.com", password: "12345678" };

describe("App E2E Test", () => {
  let app: Server;
  let accessToken: string;
  const todosRepository = AppDataSource.getRepository(Todo);

  beforeAll(async () => {
    app = createApp().listen(process.env.PORT || 4000, () => {
      console.log("Server Test Start.");
    });
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
    app.close();
  });

  describe("/api/auth/signup", () => {
    it("유저가 회원가입을 한다.", async () => {
      const { status, body } = await request(app)
        .post("/api/auth/signup")
        .send(testUser);

      expect(status).toBe(201);
      expect(body).toEqual({
        ok: true,
      });
    });
  });

  describe("/api/auth/login", () => {
    it("유저가 로그인을 한다.", async () => {
      const { status, body } = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
        data: { accessToken: expect.any(String) },
      });

      accessToken = body.data.accessToken;
    });
  });

  describe("/api/users", () => {
    it("내 정보를 조회한다", async () => {
      const { status, body } = await request(app)
        .get("/api/users/my")
        .set(TOKEN_KEY, accessToken);

      const user: Omit<User, "todos" | "password"> = {
        id: expect.any(Number),
        email: testUser.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
        data: user,
      });
    });
  });

  describe("/api/todos", () => {
    let todo: TodoDto;

    it("할일을 생성한다.", async () => {
      const data = {
        task: "할일1",
      };

      const { status, body } = await request(app)
        .post("/api/todos")
        .set(TOKEN_KEY, accessToken)
        .send(data);

      expect(status).toBe(201);
      expect(body).toEqual({
        ok: true,
        data: {
          id: expect.any(Number),
          task: data.task,
          isComplete: false,
        },
      });
    });

    it("할일을 조회한다.", async () => {
      const { status, body } = await request(app)
        .get("/api/todos")
        .set(TOKEN_KEY, accessToken);

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
        data: expect.arrayContaining([
          {
            id: expect.any(Number),
            task: expect.any(String),
            isComplete: expect.any(Boolean),
          },
        ]),
      });

      todo = body.data[0];
    });

    it("할일을 수정한다.", async () => {
      const data = {
        task: "할일2",
        isComplete: true,
      };

      const { status, body } = await request(app)
        .patch("/api/todos/" + todo.id)
        .set(TOKEN_KEY, accessToken)
        .send(data);

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
        data: {
          id: todo.id,
          task: data.task,
          isComplete: data.isComplete,
        },
      });
    });

    it("할일을 삭제한다.", async () => {
      const beforeCount = await todosRepository.count();

      const { status, body } = await request(app)
        .delete("/api/todos/" + todo.id)
        .set(TOKEN_KEY, accessToken);

      const afterCount = await todosRepository.count();

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
      });

      expect(beforeCount - afterCount).toBe(1);
    });
  });
});
