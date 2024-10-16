import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor (
    private apiService: ApiService
  ) {}

  get(username: string): Observable<Profile> {
    return this.apiService.get('/' + username)
      .pipe(map((data: {profile: Profile}) => data.profile));
  }

  follow(username: string): Observable<Profile> {
    return this.apiService.post(`/${username}/follow`, {});
  }

  unfollow(username: string): Observable<Profile> {
    return this.apiService.delete(`/${username}/follow`);
  }

  get_user_profile(username: any): Observable<Profile> {
    return this.apiService.get(`/profile/${username}`);
  }
  
}
