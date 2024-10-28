import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { ApiPrismaService } from './api-prisma.service';
import { JwtPrismaService } from './jwt-prisma.service';
import { UserEnterprise } from '../models_Prisma/auth-enterprise.model';
import { map ,  distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserEnterpriseService {

  private currentUserSubject = new BehaviorSubject<UserEnterprise>({} as UserEnterprise);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiPrismaService: ApiPrismaService,
    private jwtPrismaService: JwtPrismaService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    const token = this.jwtPrismaService.getTokenPrisma();
    console.log(token);
    if (token) {
      this.apiPrismaService.get("/api/authEnterprise/getCurrentUser").subscribe(
        (data) => {
          return this.setAuth({ ...data.usersEnterprise, token });
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

  setAuth(user: UserEnterprise) {
    // Save JWT sent from server in localstorage
    this.jwtPrismaService.saveTokenPrisma(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // console.log('hola');
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtPrismaService.destroyTokenPrisma();
    // Set current user to an empty object
    this.currentUserSubject.next({} as UserEnterprise);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<UserEnterprise> {
    const route = (type === 'login') ? '/login' : '/register';
    // console.log({user: credentials});
    return this.apiPrismaService.post(`/api/authEnterprise${route}`, {user: credentials})
      .pipe(map(
      (data: any) => {
        this.setAuth(data.usersEnterprise);
        console.log(data);
        return data;
      }
    ));
  }

  getCurrentUser(): UserEnterprise {
    return this.currentUserSubject.value;
  }
}