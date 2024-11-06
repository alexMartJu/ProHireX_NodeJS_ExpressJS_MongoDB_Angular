// src/entities/Application.ts
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";
import { Job } from "./Job";
import { User } from "./User";

@Entity()
export class Application {
    @ObjectIdColumn()
    _id!: ObjectId; // ID único de la aplicación

    @Column()
    applicationSlug!: string; // Slug Aleatorio Aplicacion

    @Column()
    slug!: string; // El slug del trabajo para el que se aplica

    @Column()
    uuid!: string; // El UUID del usuario que aplica

    @Column()
    status!: string; // Estado de la aplicación (ej. "pending", "accepted", "rejected")

    @CreateDateColumn()
    appliedAt!: Date; // Fecha de la aplicación

    @UpdateDateColumn()
    updatedAt!: Date; // Fecha de la última actualización

    @Column({ nullable: true })
    assignedAdminId?: ObjectId; // ID del administrador asignado

    @Column({ default: false }) // Añade el campo isApplied con un valor inicial de false
    isApplied!: boolean;

    @Column(type => Job)
    job?: Job; // Propiedad que representa el trabajo asociado a la aplicación

    @Column(type => User)
    user?: User; // Propiedad que representa el usuario asociado a la aplicación
}