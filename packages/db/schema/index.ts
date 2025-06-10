import { customType, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

const vector = (name: string, dimensions: number) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return JSON.stringify(value);
    },
    fromDriver(value: unknown): number[] {
      return JSON.parse(value as string);
    },
  })(name);

// Define the 'items' table schema
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  // Example for a 3-dimensional vector.
  // Change 3 to the dimension of your embeddings (e.g., 1536).
  embedding: vector('embedding', 3), 
});

export const workItems = pgTable('work_items', {
  id: serial('id').primaryKey(),
  title: text('name').notNull(),
  detail: text('detail'),
  embedding: vector('embedding', 8192),
});