import { Job } from "./job.model";

export interface Profile {
    uuid: string;
    username: string;
    bio: string;
    image: string;
    following: boolean;
    n_followers:number;
    n_follows: number;
    jobs: Job[];
    favouriteJobs: Job[];
}
