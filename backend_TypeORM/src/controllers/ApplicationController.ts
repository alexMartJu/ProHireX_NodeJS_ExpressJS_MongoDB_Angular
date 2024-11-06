// src/controllers/ApplicationController.ts
import { Request, Response } from 'express';
import { ApplicationService } from '../services/ApplicationService';
import axios from 'axios';

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

// Nuevo método para obtener inscripciones pendientes de un admin
export const getPendingApplicationsByAdmin = async (req: Request, res: Response) => {
    const adminId = req.userId;
    console.log("adminId:", adminId);

    if (!adminId) {
        res.status(400).json({ error: "Admin ID is required" });
        return;
    }

    try {
        const applications = await applicationService.getPendingApplicationsByAdmin(adminId);
        // Mapear las aplicaciones para obtener detalles de usuario y trabajo
        const response = await Promise.all(
            applications.map(async (application) => {
                try {
                    // Obtener detalles del usuario
                    const userResponse = await axios.get(`http://localhost:3001/users/applicationAdmin/${application.uuid}`); // Asegúrate de que application.userId tenga el UUID
                    const userDetails = userResponse.data.user;

                    // Obtener detalles del trabajo
                    const jobResponse = await axios.get(`http://localhost:3001/jobs/applicationAdmin/${application.slug}`); // Asegúrate de que application.jobSlug tenga el slug del trabajo
                    const jobDetails = jobResponse.data.job;

                    return {
                        applicationSlug: application.applicationSlug,
                        uuid: application.uuid,
                        status: application.status,
                        job: {
                            name: jobDetails.name,
                            company_name: jobDetails.company_name,
                            location: jobDetails.location,
                        },
                        user: {
                            username: userDetails.username,
                            email: userDetails.email,
                        },
                    };
                } catch (error) {
                    // Manejo de errores, podrías omitir el trabajo o el usuario si no se encuentran
                    return {
                        applicationSlug: application.applicationSlug,
                        uuid: application.uuid,
                        status: application.status,
                        job: null, // O puedes omitir el campo si no se encuentra
                        user: null, // O puedes omitir el campo si no se encuentra
                    };
                }
            })
        );
        // res.status(200).json(applications);
        res.status(200).json(response);
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