import bcrypt from "bcryptjs";
import { db } from "../prisma/db.ts";
import { generateToken } from "./jwt.js";

export async function loginUser(email, password) {
  const user = await db.orm.public.User
    .where({ email })
    .first();

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  };
}