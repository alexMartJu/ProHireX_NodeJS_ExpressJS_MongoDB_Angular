// src/repositories/ApplicationRepository.ts
import { AppDataSource } from '../config/database';
import { Application } from '../entities/Application';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class ApplicationRepository {
    private repo: Repository<Application>;

    constructor() {
        this.repo = AppDataSource.getRepository(Application);
    }

    async create(application: Application): Promise<Application> {
        return this.repo.save(application);
    }

    // Método para encontrar aplicaciones pendientes por admin
    async findPendingApplicationsByAdmin(adminId: string): Promise<Application[]> {
        return this.repo.find({ where: { assignedAdminId: new ObjectId(adminId), status: 'pending' } });
    }

    async findBySlugAndUuid(slug: string, uuid: string): Promise<Application | null> {
        return this.repo.findOne({ where: { slug, uuid, isApplied: true } });
    }

    async update(application: Application): Promise<Application | null> {
        await this.repo.save(application); // Usa save para actualizar el objeto completo
        return this.repo.findOneBy({ _id: new ObjectId(application._id) }); // Retorna el objeto actualizado
    }

    async findOneBySlug(applicationSlug: string): Promise<Application | null> {
        return this.repo.findOne({ where: { applicationSlug } });
    }
}