import { AppDataSource } from '../config/database';
import { UserAdmin } from '../entities/AuthAdmin';
import { Repository } from 'typeorm';

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
}
