// test true is true

import { UserStore } from "../../src/models/user";

const mocks = [
  {
    firstName: "jane",
    lastName: "Doe",
    password: "password",
  },
];

const store = new UserStore();

describe("User Model", () => {
  let userID = 1,
    password_digest = "";

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
    console.log(process.env.ENV);
  });

  it("create method should add a user", async () => {
    const result = await store.create(mocks[0]);
    userID = result.id;
    password_digest = result.password;
    expect(result).toEqual({
      id: userID,
      ...mocks[0],
      password: password_digest,
    });
    expect(result.password).not.toBe(mocks[0].password);
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: userID,
        ...mocks[0],
        password: password_digest,
      },
    ]);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(userID);
    expect(result).toEqual({
      id: userID,
      ...mocks[0],
      password: password_digest,
    });
  });

  // test authentication
  it("authenticate method should return the correct user", async () => {
    const result = await store.authenticate(userID, mocks[0].password);
    expect(result).toEqual({
      id: userID,
      ...mocks[0],
      password: password_digest,
    });
  });
  it("authenticate method should return null if password is wrong", async () => {
    const result = await store.authenticate(userID, "wrong password");
    expect(result).toBeNull();
  });

  it("delete method should remove the user", async () => {
    await store.delete(userID);
    const result = await store.index();

    expect(result).toEqual([]);
  });
});
