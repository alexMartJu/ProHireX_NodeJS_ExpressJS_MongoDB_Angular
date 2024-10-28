import { NextFunction, Request, Response } from "express";
import createUserEnterpriseToken from "../../utils/auth/createUserEnterpriseToken";
import usersEnterpriseGetEmailPrisma from "../../utils/db/authEnterprise/authEnterpriseGetEmailPrisma";
import { compareWithHash } from "../../utils/hashPasswords";
import authEnterpriseViewer from "../../view/authEnterpriseViewer";

/**
 * Users controller for the login function sending a valid jwt token in the response if login is successful.
 * @param req Request with a body property body containing a json with user object with name and email as properties.
 * @param res Response
 */
// export default async function authEnterpriseLogin(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { email, password } = req.body.user;
//   try {
//     // Get the user with given email
//     const user = await usersEnterpriseGetEmailPrisma(email);
//     // if (!user) return res.sendStatus(404);
//     if (!user) return res.sendStatus(404);

//     // Compare the user password given with the one stored
//     console.log(password, user.password);
//     // if (!compareWithHash(password, user.password)) return res.sendStatus(403);
//     const isPasswordMatch = await compareWithHash(password, user.password); // Usar await aquí
//     if (!isPasswordMatch) return res.sendStatus(403); // Contraseña incorrecta

//     // Create the user token for future authentication
//     const token = createUserEnterpriseToken(user);

//     // Create the user view containing the authentication token
//     const userView = authEnterpriseViewer(user, token);

//     return res.json(userView);
//   } catch (error) {
//     return next(error);
//   }
// }
export default async function authEnterpriseLogin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password } = req.body.user;

    try {
        // Get the user with given email
        const user = await usersEnterpriseGetEmailPrisma(email);
        // Si no hay usuario, enviar respuesta 404
        if (!user) {
            res.sendStatus(404);
            return; // Terminar la ejecución aquí
        }

        // Compare the user password given with the one stored
        console.log(password, user.password);
        const isPasswordMatch = await compareWithHash(password, user.password);
        // Si la contraseña no coincide, enviar respuesta 403
        if (!isPasswordMatch) {
            res.sendStatus(403);
            return; // Terminar la ejecución aquí
        }

        // Create the user token for future authentication
        const token = createUserEnterpriseToken(user);

        // Create the user view containing the authentication token
        const userView = authEnterpriseViewer(user, token);

        // Enviar la respuesta JSON
        res.json(userView);
    } catch (error) {
        // Manejar errores
        next(error);
    }
}