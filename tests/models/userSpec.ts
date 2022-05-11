import { PoolClient } from "pg";
import { UserStore } from "../../src/models/user";
import client from "../../src/utils/database";

const mocks = [
  {
    firstName: "jane",
    lastName: "Doe",
    password: "password",
  },
];

const store = new UserStore();

describe("User Model", () => {
  let userId: number, password_digest: string, db: PoolClient;

  beforeAll(async () => {
    db = await client.connect();
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a user", async () => {
    const result = await store.create(mocks[0]);
    userId = result.id;
    password_digest = result.password;

    // fetch user from actual database
    const user = (await db.query(`SELECT * FROM users WHERE id = $1`, [userId]))
      .rows[0];
    expect(user).toEqual({
      id: userId,
      first_name: result.firstName,
      last_name: result.lastName,
      password_digest,
    });
    expect(result.password).not.toBe(mocks[0].password);
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    // fetch user from actual database
    const userList = await db.query(`SELECT * FROM users`);
    const user = userList.rows[0];
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toEqual({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password_digest,
    });
    expect(result.length).toBe(userList.rows.length);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(userId);
    // fetch user from actual database
    const user = (await db.query(`SELECT * FROM users WHERE id = $1`, [userId]))
      .rows[0];
    expect(result).toEqual({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password_digest,
    });
  });

  //   // test authentication
  it("authenticate method should return the correct user", async () => {
    const result = await store.authenticate(userId, mocks[0].password);
    expect(result).toEqual({
      id: userId,
      ...mocks[0],
      password: password_digest,
    });
  });
  it("authenticate method should return null if password is wrong", async () => {
    const result = await store.authenticate(userId, "wrong password");
    expect(result).toBeNull();
  });

  it("delete method should remove the user", async () => {
    await store.delete(userId);
    const result = await store.index();
    result.forEach((user) => {
      expect(user.id).not.toBe(userId);
    });
  });

  afterAll(() => {
    db.release();
  });
});
