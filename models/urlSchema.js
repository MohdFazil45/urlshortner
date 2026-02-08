import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./usersSchema.js";

export const urlTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => userTable.id).notNull(),

    targetUrl: text().notNull(),
    shortCode: varchar({ length: 10 }).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').$onUpdate(() => new Date())
})