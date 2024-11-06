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

    async findBySlugAndUuid(slug: string, uuid: string): Promise<Application | null> {
        return this.repo.findOne({ where: { slug, uuid, isApplied: true } });
    }
}