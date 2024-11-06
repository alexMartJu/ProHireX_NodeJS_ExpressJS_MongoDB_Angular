// src/controllers/ApplicationController.ts
import { Request, Response } from 'express';
import { ApplicationService } from '../services/ApplicationService';

const applicationService = new ApplicationService();

export const applyForJob = async (req: Request, res: Response) => {
    const { slug, uuid } = req.body;

    if (!slug || !uuid) {
        res.status(400).json({ error: "slug and uuid are required" });
        return;
    }

    try {
        const application = await applicationService.createApplication(slug, uuid);
        res.status(201).json({ message: "Application created successfully", application });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

export const hasUserApplied = async (req: Request, res: Response) => {
    const { slug, uuid } = req.query;
    console.log("Slug recibido:", slug);
    console.log("UUID recibido:", uuid);

    if (!slug || !uuid) {
        res.status(400).json({ error: "slug and uuid are required" });
        return;
    }

    try {
        const applied = await applicationService.hasUserApplied(slug as string, uuid as string);
        res.status(200).json({ hasApplied: applied });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};