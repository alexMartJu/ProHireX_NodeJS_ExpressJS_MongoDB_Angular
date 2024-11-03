import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AuthAdminRepository } from '../repositories/AuthAdminRepository';
import { UserAdmin } from '../entities/AuthAdmin';

export class AuthAdminService {
  private userAdminRepository: AuthAdminRepository;

  constructor() {
    this.userAdminRepository = new AuthAdminRepository();
  }

  async register(username: string, email: string, password: string, image?: string) {
    const hashedPassword = await argon2.hash(password);
    const defaultImage = "https://static.productionready.io/images/smiley-cyrus.jpg";
    const user = new UserAdmin();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.image = image || defaultImage;

    const savedUser = await this.userAdminRepository.save(user);
    return savedUser.toResponse(); // Serializa la respuesta sin token
  }

  async login(email: string, password: string) {
    const user = await this.userAdminRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    // Generamos el token incluyendo el ID, email y username
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { user: user.toResponse(token) }; // Serializa la respuesta con token
  }

  async getCurrentUser(email?: string): Promise<UserAdmin> {
    // Verifica que el email no sea undefined
    if (!email) throw { status: 401, message: "Unauthorized: No email found in token" };

    // Busca al usuario por email
    const user = await this.userAdminRepository.findByEmail(email);
    if (!user) throw { status: 404, message: "User Not Found" };

    return user;
}

}
