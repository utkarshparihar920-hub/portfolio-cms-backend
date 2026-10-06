import { db } from "../prisma/db.ts";

const user = await db.orm.public.User
  .where({ email: "admin@example.com" })
  .first();

console.log(user);