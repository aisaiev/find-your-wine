import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const wines = pgTable(
  "wines",
  {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    reviewCount: integer().notNull(),
    score: numeric({ mode: "number" }).notNull(),
    link: varchar({ length: 255 }).notNull(),
    searchTerm: varchar({ length: 100 }).notNull(),
    market: varchar({ length: 50 }).notNull(),
    productId: varchar({ length: 255 }).notNull(),
    confidence: varchar({ length: 10 }).notNull().default("high"),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("market_product_idx").on(table.market, table.productId),
  ]
);

export default wines;
