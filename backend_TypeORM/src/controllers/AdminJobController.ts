// AdminController.ts
import { Request, Response } from 'express';
import { AdminService } from '../services/AdminJobService';
import { Job } from '../entities/AuthAdmin';
import axios from "axios";

const adminService = new AdminService();

export const assignAdminToJob = async (req: Request, res: Response) => {
    const { slug } = req.body; // Obtenemos el slug del cuerpo de la solicitud

    if (!slug) {
        res.status(400).json({ error: "slug is required" }); // Validación simple
        return;
    }

    try {
        const assignedAdmin = await adminService.assignRandomAdmin();
        res.status(200).json({ adminId: assignedAdmin._id });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

//
export const listJobsForAdmin = async (req: Request, res: Response) => {
    console.log("entro aqui");
    const adminId = req.userId as string;

    console.log("adminId:", adminId);
    try {
        const jobs = await adminService.listAdminJobs(adminId);
        if (!jobs) {
            res.status(404).json({ message: "Administrador no encontrado" });
            return;
        }

        res.status(200).json(jobs);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

// Este método se usa para asignar un trabajo a un administrador específico
export const assignJobToAdmin = async (req: Request, res: Response) => {
    const { slug, name, price, description, img, company_name, id_cat, images, location, requirements, state,adminId } = req.body;

    // Validación simple de entrada
    if (!adminId) {
        res.status(400).json({ error: "adminId is required" });
        return;
    }

    // Crea el objeto de trabajo
    const job: Job = { slug, name, price, description, img, company_name, id_cat, images, location, requirements, state };

    try {
        // Llama al método assignJobToAdmin del servicio
        const updatedAdmin = await adminService.assignJobToAdmin(adminId, job);

        if (!updatedAdmin) {
            res.status(404).json({ message: "Administrador no encontrado" });
            return;
        }

        res.status(200).json({ message: "Trabajo asignado correctamente", jobs: updatedAdmin.jobs });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const respondToJobOffer = async (req: Request, res: Response) => {
    const { slug, response } = req.body; // `response` puede ser "accept" o "reject"

    if (!slug || !response) {
        res.status(400).json({ message: "slug and response are required" });
        return;
    }

    // Aquí puedes manejar la lógica para aceptar o rechazar la oferta
    try {
        // Actualiza el estado del trabajo
        const updatedJob = await adminService.updateJobState(slug, response === "accept" ? "accepted" : "rejected");

        if (!updatedJob) {
            res.status(404).json({ message: "Job not found" });
            return;
        }

        // Ahora, actualiza el estado del trabajo en Backend Prisma
        const backendResponse = await axios.put(`http://localhost:3004/api/jobs/${slug}`, { slug, state: updatedJob.state });

        if (backendResponse.status !== 200) {
            res.status(500).json({ message: "Error updating job in the first backend" });
            return;
        }

        res.status(200).json({ message: "Job response processed successfully", job: updatedJob });
        return;
    } catch (error) {
        console.error("Error responding to job offer:", error);
        res.status(500).json({ message: "Error processing response" });
        return;
    }
};
