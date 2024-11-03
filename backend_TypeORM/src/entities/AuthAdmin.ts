import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class UserAdmin {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Método para serializar la entidad a una respuesta de usuario
  toResponse(token?: string) {
    const response: any = {
      _id: this._id,
      username: this.username,
      email: this.email,
      image: this.image,
      createdAt: this.createdAt,
    };
    
    // Solo añade el token si está presente
    if (token) {
      response.token = token;
    }

    return response;
  }
}
