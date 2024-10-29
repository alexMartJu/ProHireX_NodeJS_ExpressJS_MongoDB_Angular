import { NextFunction, Response, Request } from "express";
import userGetPrisma from "../../utils/db/authEnterprise/authEnterpriseGetPrisma";
import jobViewer from "../../view/jobsViewer";
import jobsListPrisma from "../../utils/db/jobs/jobsListPrisma";

/**
 * Job listing controller.
 * Fetches all jobs where the company_name in jobs matches the username in usersEnterprise.
 * @param req Request with optional JWT token
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const username = req.userUsername; // Obtener el username desde la propiedad extendida
  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  try {
    // Verificar si la empresa existe
    const enterpriseUser = await userGetPrisma(username);
    if (!enterpriseUser) {
      res.status(404).json({ error: "Empresa no encontrada" });
      return;
    }

    // Obtener trabajos que coincidan con el `company_name`
    const jobs = await jobsListPrisma(username);

    // Crear la vista para cada trabajo
    const jobsListView = jobs.map((job) => jobViewer(job));

    res.json(jobsListView);
  } catch (error) {
    return next(error);
  }
}
