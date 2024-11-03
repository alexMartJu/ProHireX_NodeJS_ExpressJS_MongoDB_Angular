import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { ApiTypeORMService } from './api-type-orm.service';
import { JwtTypeORMService } from './jwt-type-orm.service';
import { UserAdmin } from '../models_TypeORM/auth-admin.model';
import { map ,  distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  private currentUserSubject = new BehaviorSubject<UserAdmin>({} as UserAdmin);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiTypeORMService: ApiTypeORMService,
    private jwtTypeORMService: JwtTypeORMService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    const token = this.jwtTypeORMService.getTokenTypeORM();
    console.log(token);
    if (token) {
      this.apiTypeORMService.get("/api/authAdmin/current").subscribe(
        (data) => {
          return this.setAuth({ ...data.user, token });
        },
        (err) => {
          console.error('Error al obtener el usuario:', err); // Manejo de errores
          this.purgeAuth();
        }
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: UserAdmin) {
    // Save JWT sent from server in localstorage
    this.jwtTypeORMService.saveTokenTypeORM(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // console.log('hola');
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtTypeORMService.destroyTokenTypeORM();
    // Set current user to an empty object
    this.currentUserSubject.next({} as UserAdmin);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<UserAdmin> {
    const route = (type === 'login') ? '/login' : '/register';
    console.log({user: credentials});
    console.log(route);
    return this.apiTypeORMService.post(`/api/authAdmin${route}`, {user: credentials})
      .pipe(map(
      (data: any) => {
        this.setAuth(data);
        console.log(data);
        return data;
      }
    ));
  }

  getCurrentUser(): UserAdmin {
    return this.currentUserSubject.value;
  }

}