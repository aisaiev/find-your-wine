import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { winesRoute } from "./routes/wines";
import { cors } from 'hono/cors';

const app = new Hono();

app.use("*", logger(), cors());

const api = app.basePath("/api");

api.route("/wines", winesRoute);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
