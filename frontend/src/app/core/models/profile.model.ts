export interface Profile {
    uuid: string;
    username: string;
    bio: string;
    image: string;
    following: boolean;
    n_followers:number;
    n_follows: number;
}
