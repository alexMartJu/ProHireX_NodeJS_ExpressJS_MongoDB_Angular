import { NextFunction, Response, Request } from "express";
// import { Request } from "express-jwt";
import userGetPrisma from "../../utils/db/authEnterprise/authEnterpriseGetPrisma";
import authEnterpriseViewer from "../../view/authEnterpriseViewer";

export default async function authEnterpriseGetUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const username = req.userUsername;
    // Validar si `username` está definido
    if (!username) {
        res.status(400).json({ message: "Username is required" });
        return;
    }

    try {

      // Get current user
      const currentUser = await userGetPrisma(username);
      if (!currentUser) {
        res.sendStatus(404);
        return;
      }
  
      // Create the user view without a new token
      const response = authEnterpriseViewer(currentUser);
  
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  