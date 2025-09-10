import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const wines = pgTable("wines", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  reviewCount: integer().notNull(),
  score: numeric({ mode: "number" }).notNull(),
  link: varchar({ length: 255 }).notNull(),
  searchTerm: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default wines;
