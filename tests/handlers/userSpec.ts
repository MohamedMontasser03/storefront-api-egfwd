// test user endpoints

import { decode, JwtPayload, sign } from "jsonwebtoken";
import supertest from "supertest";
import { UserStore } from "../../src/models/user";
import app from "../../src/server";

let request = supertest(app);
const userStore = new UserStore();

describe("User Handler", () => {
  const mockToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJmaXJzdF9uYW1lIjoiTW9oYW1lZCIsImxhc3RfbmFtZSI6Ik1vbnRhc3NlciIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCQ4UjlaWTRiQjE0YzQubG1HSWVjUWQudjlHVE1UaUF4Lkx5YUQ3dWpVTUFxWldZM1B5V0NhLiJ9LCJpYXQiOjE2NTIwMzQzMDN9.UyUTHfO5yYWHyn5S5FJs2asoYRcAS3zyZJjd052VvE0";
  let userId = 1;

  it("should show a list of all users when GET /users if authenticated", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${mockToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(await userStore.index());
  });
  it("should fail to show a list of all users when GET /users if not authenticated", async () => {
    const response = await request.get("/users");
    expect(response.status).toBe(401);
    expect(response.body).toEqual("Access denied, invalid token");
  });
  it("should create a new user when POST /users", async () => {
    const response = await request.post("/users").send({
      firstName: "John",
      lastName: "Doe",
      password: "123456",
    });
    const users = await userStore.index();
    userId = users[users.length - 1].id;
    // get user from token
    const token = response.body.token;
    const decoded = decode(token) as JwtPayload;
    const user = decoded.user;

    expect(response.status).toBe(201);
    expect(user.id).toBe(userId);
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
  });

  it("should authenticate a user when POST /users/login", async () => {
    const response = await request.post("/users/login").send({
      id: userId,
      password: "123456",
    });
    const user = (decode(response.body.token) as JwtPayload).user;
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(user.id).toBe(userId);
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
  });
  it("should return a 401 when POST /users/login with invalid credentials", async () => {
    const response = await request.post("/users/login").send({
      id: userId,
      password: "wrong password",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual("Access denied, invalid credentials");
  });
  it("should return a 404 when GET /users/:id if user does not exist", async () => {
    const response = await request
      .get(`/users/${userId + 1}`)
      .set("Authorization", `Bearer ${mockToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual("User not found");
  });
  it("should show a user when GET /users/:id if user exists", async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${mockToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(await userStore.show(userId));
  });
  it("should fail to show a user when GET /users/:id if invalid credentials", async () => {
    const response = await request.get(`/users/${userId}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual("Access denied, invalid token");
  });
});
