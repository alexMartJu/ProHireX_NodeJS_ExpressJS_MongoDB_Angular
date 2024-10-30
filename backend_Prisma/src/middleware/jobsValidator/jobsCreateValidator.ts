import { NextFunction, Response, Request } from "express";
import { ValidationError } from "../../utils/types";
import prisma from "../../utils/db/prisma";

/**
 * Middleware to validate input for job creation controller.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function jobCreateValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  // Comprobar si el cuerpo de la solicitud está vacío
  if (!req.body) {
    errors.body.push("can't be empty");
    res.status(400).json({ errors });
    return;
  }

  // Extraer los demás campos del cuerpo de la solicitud
  const { id_cat, name, price, description, img, company_name, images, location, requirements } = req.body;

  // Verificar que el campo "id_cat" está presente y que la categoría existe
  if (!id_cat) {
    errors.body.push("El campo id_cat es obligatorio");
  } else {
    const category = await prisma.categories.findFirst({
      where: { id_cat: id_cat },
    });
    if (!category) {
      errors.body.push("La categoría especificada no existe");
    }
  }

  // Verificación de campos requeridos
  if (!name) errors.body.push("El campo nombre es obligatorio");
  if (typeof price !== "number") errors.body.push("El precio debe ser un número");
  if (!description) errors.body.push("El campo descripción es obligatorio");
  if (!img) errors.body.push("El campo img es obligatorio");
  if (!company_name) errors.body.push("El campo nombre de la empresa es obligatorio");
  if (!images || !images.length) errors.body.push("El campo imágenes debe ser un array no vacío");
  if (!location) errors.body.push("El campo ubicación es obligatorio");
  if (!requirements) errors.body.push("El campo requisitos es obligatorio");

  // Si hay errores, devuelve una respuesta con el estado 400
  if (errors.body.length) {
    console.log("Errores:", errors); // Para depurar
    res.status(400).json({ errors });
    return;
  }

  // Continúa al siguiente middleware o controlador
  next();
}
