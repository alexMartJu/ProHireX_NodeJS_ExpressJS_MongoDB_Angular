import { NextFunction, Response, Request } from "express";
import updateJobStateBySlug from "../../utils/db/jobs/updateJobStateBySlug"; 

/**
 * Controller to update the job state.
 * Expects slug and state in the request body.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function updateJobState(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug, state } = req.body; 

  // Validar que se hayan proporcionado slug y state
  if (!slug || !state) {
    res.status(400).json({ message: "slug and state are required" });
    return;
  }

  try {
    // Actualizar el estado del trabajo en la base de datos
    const updatedJob = await updateJobStateBySlug(slug, state);

    if (!updatedJob) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Retornar el trabajo actualizado
    res.status(200).json({ message: "Job state updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error updating job state:", error);
    return next(error); // Pasar el error al manejador de errores
  }
}