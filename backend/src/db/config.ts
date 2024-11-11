import * as dotenv from "dotenv"
dotenv.config({ path: './src/db/.env' });

const NEON_DB_KEY = process.env.NEON_DB_KEY;

export default NEON_DB_KEY;
