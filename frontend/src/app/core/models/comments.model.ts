import { Profile } from './profile.model';

export interface Comments {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}