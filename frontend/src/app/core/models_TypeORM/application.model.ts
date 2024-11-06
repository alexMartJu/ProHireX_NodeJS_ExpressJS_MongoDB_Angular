import { Job } from "../models/job.model";
import { User } from "../models/auth.model";

export interface Application {
    applicationSlug: string;
    slug: string; // El slug del trabajo para el que se aplica
    uuid: string; // El UUID del usuario que aplica
    status: 'pending' | 'accepted' | 'rejected'; // Estado de la aplicación
    appliedAt: Date; // Fecha de la aplicación
    isApplied: boolean;
    job?: Job; // Información del trabajo asociado (opcional)
    user?: User; // Información del usuario asociado (opcional)
}