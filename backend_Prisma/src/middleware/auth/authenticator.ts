import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Extiende la interfaz Request de express
declare global {
    namespace Express {
        interface Request {
            userId?: string;  // O puedes usar number, dependiendo de tu diseño
            userEmail?: string; // O puedes usar otro tipo si es necesario
            userUsername?: string
        }
    }
}

// Define la interfaz para el token decodificado
interface DecodedToken extends JwtPayload {
    usersEnterprise: {
        id: string;
        email: string;
        username: string;
    };
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Comprobar que el encabezado de autorización está presente y tiene el formato correcto
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Token ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token);

    // Verificar que la clave secreta esté definida
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'Server error: JWT_SECRET is not defined' });
        return;
    }

    try {
        // Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, secret) as DecodedToken; // Afirmación de tipo aquí
        console.log('Decoded token:', decoded);

        // Acceder a la propiedad `usersEnterprise` del token decodificado
        const user = await prisma.usersEnterprise.findUnique({
            where: { id: decoded.usersEnterprise.id }, // Usar decoded.usersEnterprise.id
        });

        // Si no se encuentra el usuario, devolver un error 403
        if (!user) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Si se encuentra el usuario, asignar la información a req para su uso posterior
        req.userId = user.id;
        req.userEmail = user.email;
        req.userUsername = user.username;
        next();
    } catch (err) {
        // Aserción de tipo para acceder a las propiedades de Error
        if (err instanceof Error) {
            console.error('Error de verificación del token:', err.message);
        } else {
            console.error('Error desconocido al verificar el token:', err);
        }
        res.status(403).json({ message: 'Forbidden' });
    }
};

export default verifyJWT;
