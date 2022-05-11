import { compareSync, hashSync } from "bcrypt";
import client from "../utils/database";

const { SALT_ROUNDS: saltRounds, BCRYPT_PASSOWRD: pepper } = process.env;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
};

function formatUser(user: {
  id: number;
  first_name: string;
  last_name: string;
  password_digest: string;
}): User {
  const {
    id,
    first_name: firstName,
    last_name: lastName,
    password_digest: password,
  } = user;
  return { id, firstName, lastName, password };
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows.map((user) => formatUser(user));
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return formatUser(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: Omit<User, "id">): Promise<User> {
    try {
      const sql =
        "INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING *";
      const hash = hashSync(u.password + pepper, Number(saltRounds));

      const conn = await client.connect();

      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);

      const user = result.rows[0];

      conn.release();

      return formatUser(user);
    } catch (err) {
      throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";

      const result = await conn.query(sql, [id]);

      if (result.rows.length) {
        const user = result.rows[0];

        if (compareSync(password + pepper, user.password_digest)) {
          return formatUser(user);
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${id}. Error: ${err}`);
    }
  }
}
