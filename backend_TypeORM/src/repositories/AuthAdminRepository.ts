import { AppDataSource } from '../config/database';
import { UserAdmin } from '../entities/AuthAdmin';
import { Repository } from 'typeorm';
import { ObjectId } from "mongodb";

export class AuthAdminRepository {
  private repo: Repository<UserAdmin>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserAdmin);
  }

  async findByEmail(email: string): Promise<UserAdmin | null> {
    return this.repo.findOneBy({ email });
  }

  async save(user: UserAdmin): Promise<UserAdmin> {
    return this.repo.save(user);
  }

  async findAll(): Promise<UserAdmin[]> {
    return this.repo.find(); // Devuelve todos los administradores
  }
//
  async findById(id: string): Promise<UserAdmin | null> {
    return this.repo.findOne({ where: { _id: new ObjectId(id) } });
  }

  async findAdminWithJob(slug: string): Promise<UserAdmin | null> {
    // Encuentra todos los administradores y filtra el que tenga el trabajo específico
    const admins = await this.repo.find(); 
    return admins.find(admin => 
        admin.jobs?.some(job => job.slug === slug)
    ) || null;
  }

  // Método para obtener un admin aleatorio
  async getRandomAdmin(): Promise<UserAdmin> {
    const admins = await this.repo.find();
    const randomIndex = Math.floor(Math.random() * admins.length);
    return admins[randomIndex]; // Retorna un admin aleatorio
  }
}
