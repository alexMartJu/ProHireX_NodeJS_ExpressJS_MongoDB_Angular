import prisma from "../prisma"; // Ajusta la ruta según tu estructura de carpetas

/**
 * Update the state of a job using its slug.
 * @param slug The slug of the job to update
 * @param state The new state for the job
 * @returns The updated job or null if not found
 */
async function updateJobStateBySlug(slug: string, state: string) {
  try {
    // Actualiza el estado del trabajo en la base de datos
    const updatedJob = await prisma.jobs.update({
      where: { slug: slug }, 
      data: { state: state }, // Cambia el estado del trabajo
    });

    return updatedJob; // Devuelve el trabajo actualizado
  } catch (error) {
    console.error("Error updating job state in database:", error);
    throw error; // Lanza el error para que el controlador lo maneje
  }
}

export default updateJobStateBySlug;