import { Pool } from "pg";
import { config } from "dotenv";
config();

// get data from environment variables
const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  ENV,
} = process.env;

const client = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  database: ENV === "test" ? POSTGRES_TEST_DB : POSTGRES_DB,
  port: 5432,
  ssl: false,
});

export default client;
