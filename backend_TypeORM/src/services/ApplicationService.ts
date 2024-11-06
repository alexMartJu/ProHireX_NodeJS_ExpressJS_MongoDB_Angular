// src/services/ApplicationService.ts
import { Application } from '../entities/Application';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { AuthAdminRepository } from '../repositories/AuthAdminRepository'; // Asegúrate de importar esto
import { generateSlug } from '../utils/slugGenerator';

export class ApplicationService {
    private applicationRepository: ApplicationRepository;
    private userAdminRepository: AuthAdminRepository; // Nuevo repositorio para UserAdmin

    constructor() {
        this.applicationRepository = new ApplicationRepository();
        this.userAdminRepository = new AuthAdminRepository(); // Inicializa el repositorio
    }

    async createApplication(slug: string, uuid: string): Promise<Application> {
        const application = new Application();
        application.slug = slug;
        application.uuid = uuid;
        application.status = 'pending';
        application.appliedAt = new Date();
        application.isApplied = true;
        application.applicationSlug = generateSlug();

        // Obtener un admin aleatorio
        const randomAdmin = await this.userAdminRepository.getRandomAdmin(); // Implementa este método en el repositorio
        application.assignedAdminId = randomAdmin._id; // Asigna el idAdmin

        return this.applicationRepository.create(application);
    }

    async hasUserApplied(slug: string, uuid: string): Promise<boolean> {
        const application = await this.applicationRepository.findBySlugAndUuid(slug, uuid);
        return application !== null; // Retorna true si se encontró la aplicación
    }

}