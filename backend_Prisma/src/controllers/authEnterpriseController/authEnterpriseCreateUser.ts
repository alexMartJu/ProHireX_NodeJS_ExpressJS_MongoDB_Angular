import { NextFunction, Request, Response } from "express";
import userCreatePrisma from "../../utils/db/authEnterprise/authEnterpriseCreatePrisma";
import { hashPassword } from "../../utils/hashPasswords";
import authEnterpriseViewer from "../../view/authEnterpriseViewer";

/**
 * Users controller that creates a user with information given in the body of the request.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
export default async function authEnterpriseCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, username } = req.body.user;

  try {
    // Hash password
    const hashed = await hashPassword(password);

    // Create the new user in the database
    const user = await userCreatePrisma(username, email, hashed);

    // Create the user view (sin token)
    const userView = authEnterpriseViewer(user); // Solo retorna la información del usuario

    // Enviar respuesta con el nuevo usuario
    res.status(201).json(userView);
  } catch (error) {
    next(error);
  }
}
