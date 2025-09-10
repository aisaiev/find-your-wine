import { ZodError, z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  WINE_UPDATE_INTERVAL_MINUTES: z.string().transform(Number).pipe(z.number()),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    throw new Error("Missing required values in .env");
  } else {
    console.error(error);
  }
}

export default envSchema.parse(process.env);
