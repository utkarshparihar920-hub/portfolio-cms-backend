import "dotenv/config";
import { generateToken, verifyToken } from "./jwt.js";

const token = generateToken({
  id: 1,
  role: "admin",
});

console.log("Generated token:", token);

const decoded = verifyToken(token);

console.log("Decoded token:", decoded);