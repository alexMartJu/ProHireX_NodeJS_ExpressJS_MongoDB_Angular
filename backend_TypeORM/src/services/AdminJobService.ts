// AdminService.ts
import { AuthAdminRepository } from '../repositories/AuthAdminRepository';
import { UserAdmin } from '../entities/AuthAdmin';
import { Job } from '../entities/AuthAdmin';

export class AdminService {
    private userAdminRepository: AuthAdminRepository;

    constructor() {
        this.userAdminRepository = new AuthAdminRepository();
    }

    async assignRandomAdmin(): Promise<UserAdmin> {
        const admins = await this.userAdminRepository.findAll();

        if (admins.length === 0) throw new Error('No available admins');

        const randomIndex = Math.floor(Math.random() * admins.length);
        return admins[randomIndex]; // Devuelve el administrador seleccionado aleatoriamente
    }

    //
    async assignJobToAdmin(adminId: string, job: Job): Promise<UserAdmin | null> {
        const admin = await this.userAdminRepository.findById(adminId);
        if (!admin) return null;

        // Inicializa el array de jobs si es necesario
        if (!admin.jobs) {
            admin.jobs = [];
        }

        admin.jobs.push(job); // Agrega el nuevo trabajo
        return this.userAdminRepository.save(admin); // Guarda los cambios
    }

    async listAdminJobs(adminId: string): Promise<Job[] | null> {
        const admin = await this.userAdminRepository.findById(adminId);
        return admin ? admin.jobs || [] : null;
    }

    async updateJobState(slug: string, state: string): Promise<Job | null> {
        const admin = await this.userAdminRepository.findAdminWithJob(slug);
        if (!admin) {
            return null; 
        }
    
        // Busca el índice del trabajo específico
        const jobIndex = admin.jobs?.findIndex(job => job.slug === slug);
        if (jobIndex === undefined || jobIndex === -1) {
            return null; // Trabajo no encontrado en el administrador
        }
    
        // Actualiza el estado del trabajo
        admin.jobs![jobIndex].state = state; 
    
        await this.userAdminRepository.save(admin); // Guarda los cambios en el administrador
    
        return admin.jobs![jobIndex]; // Retorna el trabajo actualizado
    }
    
    
    
}
