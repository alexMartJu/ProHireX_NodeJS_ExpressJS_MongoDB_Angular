import { NextFunction, Response, Request } from "express";
import jobCreatePrisma from "../../utils/db/jobs/jobsCreatePrisma";
import jobViewer from "../../view/jobsViewer";
import axios from "axios";

interface Job {
    name: string;
    price: number;
    description: string;
    img: string;
    company_name: string;
    id_cat: string;
    images: string[];
    location: string;
    requirements: string;
}

/**
 * Job controller that must receive a request with an authenticated user.
 * The body of the request must have the job object that is an @interface Job.
 * @param req Request with a jwt token verified
 * @param res Response
 * @param next NextFunction
 */
export default async function jobCreate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, price, description, img, company_name, id_cat, images, location, requirements }: Job = req.body;

    try {
        // Crea el trabajo sin el usuario actual
        const job = await jobCreatePrisma(
            { name, price, description, img, company_name, id_cat, images, location, requirements }
        );

        // Asigna un administrador al trabajo
        let assignedAdminId: string | undefined; // Variable para guardar el ID del admin asignado
        try {
            const adminResponse = await axios.post(
                "http://localhost:3017/api/admin/assignAdmin",
                { slug: job.slug }
            );
            assignedAdminId = adminResponse.data.adminId; // Suponiendo que el ID del admin asignado viene en adminId
        } catch (error) {
            console.error("Error al asignar un administrador al trabajo:", error);
            // Maneja el error si es necesario
        }

        // Crea un objeto job con el administrador asignado
        const jobWithAdmin = {
            ...job,
            assignedAdmin: assignedAdminId, // Aquí estás guardando el ID del admin
            adminId: assignedAdminId, // Asigna el ID del admin o undefined si no se pudo asignar
            slug: job.slug
        };

        // Enviar los detalles del trabajo al segundo backend
        try {
            await axios.post("http://localhost:3017/api/admin/assignJob", jobWithAdmin);
        } catch (error) {
            console.error("Error al enviar el trabajo al segundo backend:", error);
            // Maneja el error si es necesario
        }


        // Crea la vista del trabajo
        const jobView = jobViewer(jobWithAdmin);
        res.status(201).json(jobView);
    } catch (error) {
        return next(error);
    }
}
