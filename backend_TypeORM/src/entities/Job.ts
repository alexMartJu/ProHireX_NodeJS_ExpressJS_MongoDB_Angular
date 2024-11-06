import { Column } from "typeorm";

export class Job {
    @Column()
    name!: string;

    @Column()
    company_name!: string;

    @Column()
    location!: string;
}