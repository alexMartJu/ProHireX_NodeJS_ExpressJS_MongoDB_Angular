import { usersEnterprise } from "@prisma/client";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Creates a token containing the user information for future authorization.
 * @param usersEnterprise User information to create the token
 * @returns the token created
 */
export default function createUserEnterpriseToken(usersEnterprise: usersEnterprise) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET missing in environment.");
//   const tokenObject = { usersEnterprise: { username: usersEnterprise.username, email: usersEnterprise.email } };
  const tokenObject = { usersEnterprise: { id: usersEnterprise.id, username: usersEnterprise.username, email: usersEnterprise.email } };
  const token = jwt.sign(tokenObject, process.env.JWT_SECRET,{ expiresIn: '1d' });
  return token;
}