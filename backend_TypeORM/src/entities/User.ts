import { Column } from "typeorm";

export class User {
    @Column()
    username!: string;

    @Column()
    email!: string;
}