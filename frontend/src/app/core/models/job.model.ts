import { Profile } from "./profile.model"; //añadido

export interface Job {
    slug: string;
    name: string;
    description: string;
    price: number;
    images: [],
    img: string,
    id_cat: string;
    company_name: string;      
    published_at: Date;        
    location: string;          
    requirements: string;
    favorited: boolean;  //añadido de aqui hacia abajo
    favoritesCount: number;
    author: Profile;
}
