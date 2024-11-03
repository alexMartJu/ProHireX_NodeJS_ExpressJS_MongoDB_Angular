import { Request, Response } from 'express';
import { AuthAdminService } from '../services/AuthAdminService';

const userAdminService = new AuthAdminService();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, image } = req.body;
        const user = await userAdminService.register(username, email, password, image);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body.user || req.body;
        console.log(req.body);
        const { user } = await userAdminService.login(email, password);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await userAdminService.getCurrentUser(req.userEmail);
        res.status(200).json({
            user: user.toResponse() // Serializa el usuario usando el método correspondiente
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};