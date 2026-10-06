import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../prisma/db.ts";

const email = "admin@example.com";
const password = "Admin@123";

const hashedPassword = await bcrypt.hash(password, 10);

const existingUser = await db.orm.public.User
  .where({ email })
  .first();

if (existingUser) {
  console.log("Admin user already exists.");
} else {
  const admin = await db.orm.public.User.create({
    email,
    username: "admin",
    name: "Admin",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created successfully:", admin.email);
}