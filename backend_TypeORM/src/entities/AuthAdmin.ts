import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

// Define la interfaz Job para mayor claridad
export interface Job {
  slug: string; // Identificador del trabajo
  name: string;
  price: number;
  description: string;
  img: string;
  company_name: string;
  id_cat: string;
  images: string[];
  location: string;
  requirements: string;
  state?: string;
}

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

  @Column("json", { nullable: true }) // Almacena trabajos como JSON
  jobs?: Job[]; // Usando la interfaz Job para mayor claridad

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
