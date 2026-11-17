import pg from "pg";
import dotenv from "dotenv";
import path from "path";

// Load root .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

const { Pool } = pg;

export const dbPool = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5433", 10),
    database: process.env.POSTGRES_DB || "crawlscope",
    user: process.env.POSTGRES_USER || "crawlscope_user",
    password: process.env.POSTGRES_PASSWORD || "crawlscope_secret",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
});
