import { Job } from "../models/job.model";

export interface UserAdmin {
    email: string;
    token: string;
    username: string;
    image: string;
    jobs?: Job[];
}