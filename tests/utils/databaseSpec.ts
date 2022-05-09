// test database connection

import client from "../../src/utils/database";

describe("Database", () => {
  it("should connect", async () => {
    const conn = await client.connect();
    expect(conn).toBeTruthy();
    conn.release();
  });
});
