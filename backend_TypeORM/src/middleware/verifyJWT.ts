// src/middleware/verifyJWT.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

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

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    // Asegúrate de que authHeader sea una cadena
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Token ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token); 

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            console.error('Error de verificación del token:', err.message);
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        console.log('Decoded token:', decoded);
        req.userId = (decoded as any).userId;  // Cambia según el contenido del token
        req.userEmail = (decoded as any).email; // Asegúrate de que coincida con lo que pones en el token
        req.userUsername = (decoded as any).username; // Extraer el username
        next();
    });
};
