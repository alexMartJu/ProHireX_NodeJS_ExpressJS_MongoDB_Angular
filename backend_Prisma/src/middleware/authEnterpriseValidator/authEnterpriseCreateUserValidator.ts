import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../utils/types";

/**
 * Middleware to validate the user information in the request for creating a new user.
 * If the request is malformed, it responds accordingly and stops the flow of Express.
 * If the request is well-formed, it passes control to the next handler.
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
export default async function userCreationValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors: ValidationError = {};
    errors.body = [];

    if (!req.body) {
        errors.body.push("Request body can't be empty");
        res.status(400).json({ errors });
        return;
    }

    const { user } = req.body;
    if (!user) {
        errors.body.push("User object must be defined");
        res.status(400).json({ errors });
        return;
    }

    const { username, email, password } = user;

    // Validar username
    if (!username) {
        errors.body.push("Username property in user can't be empty");
    } else if (typeof username !== "string") {
        errors.body.push("Username property in user must be a string");
    }

    // Validar email
    if (!email) {
        errors.body.push("Email property in user can't be empty");
    } else if (typeof email !== "string") {
        errors.body.push("Email property in user must be a string");
    }

    // Validar password
    if (!password) {
        errors.body.push("Password property in user can't be empty");
    } else if (typeof password !== "string") {
        errors.body.push("Password property in user must be a string");
    }

    // Si hay errores, devolver respuesta con errores
    if (errors.body.length) {
        res.status(400).json({ errors });
        return;
    }

    // Si todo está bien, continuar al siguiente middleware
    next();
}
