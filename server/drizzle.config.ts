import { defineConfig } from "drizzle-kit";
import env from "./src/env.js";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./drizzle",  
  dbCredentials: { url: env.DATABASE_URL },
});
