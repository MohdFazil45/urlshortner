import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable('users',{
    id:uuid().primaryKey().defaultRandom(),

    firstName:varchar('first_name',{length:55}).notNull(),
    lastName:varchar('last_name',{length:55}),

    email:varchar({length:255}).notNull().unique(),
    
    createdAt:timestamp('created_at').defaultNow().notNull(),
    updateAt:timestamp('updated_at').$onUpdate(() => new Date())

})