import { NextFunction, Response, Request } from "express";
import jobCreatePrisma from "../../utils/db/jobs/jobsCreatePrisma";
import jobViewer from "../../view/jobsViewer";

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

        // Crea la vista del trabajo
        const jobView = jobViewer(job);
        res.status(201).json(jobView);
    } catch (error) {
        return next(error);
    }
}
