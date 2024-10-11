import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject ,  ReplaySubject, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/auth.model';
import { map ,  distinctUntilChanged, tap, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private http: HttpClient,
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    const token = this.jwtService.getToken();
    const refreshToken = this.jwtService.getRefreshToken();

    if (token && refreshToken) {
        this.apiService.get("/user").pipe(
            catchError(err => {
                // Si hay un error, intenta renovar el token
                if (err.status === 403) {
                  console.log("Entro aqui 1");
                    return this.refreshAccessToken().pipe(
                        switchMap(newAccessToken => {
                            // Si el nuevo token fue renovado correctamente, vuelve a intentar la llamada
                            return this.apiService.get("/user");
                        })
                    );
                }
                return throwError(err);
            })
        ).subscribe(
            (data) => {
              console.log("Entro aqui 2");
                // Asegúrate de que aquí se llame a setAuth solo después de obtener datos válidos
                this.setAuth({ ...data.user, token: this.jwtService.getToken(), refreshToken });
            },
            (err) => {
                console.error('Error al obtener el usuario:', err);
                this.purgeAuth();
            }
        );
    } else {
        this.purgeAuth();
    }
  } 


  setAuth(user: User) {
    console.log("entro setAuth");
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    console.log("access_token SetAuth: ", user.token);
    this.jwtService.saveRefreshToken(user.refreshToken);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    const refreshToken = this.jwtService.getRefreshToken(); // Obtén el refresh token antes de eliminarlo

    if (refreshToken) {
      // Si hay un refresh token válido, envíalo al backend para agregarlo a la blacklist
      this.http.post<void>(`${environment.api_url}/users/logout`, { token: refreshToken })
        .subscribe(
          () => {
            console.log("Refresh token added to blacklist successfully");
            // Ahora que el refresh token ha sido blacklisted, limpiamos el estado de autenticación
            this.completeLogout();
          },
          (error) => {
            console.error("Error adding refresh token to blacklist:", error);
            // Limpia el estado de autenticación incluso si hubo un error
            this.completeLogout();
          }
        );
    } else {
      this.completeLogout(); // Si no hay refresh token, simplemente limpia el estado
    }
  }

  completeLogout() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    this.jwtService.destroyRefreshToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post(`/users${route}`, {user: credentials})
      .pipe(map(
      data => {
        if (type === 'login') {
          this.setAuth(data.user);
        }
        return data;
      }
    ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user: User): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }

//   refreshAccessToken() --> Solicita un nuevo Access Token utilizando el Refresh Token almacenado.
//  Este método realiza una solicitud al servidor para obtener un nuevo Access Token
//  basado en el Refresh Token guardado en el almacenamiento local. Si la solicitud
//  es exitosa, el nuevo Access Token se guarda en el almacenamiento local y se devuelve
//  para su uso posterior. Si ocurre un error, se maneja y se lanza para su gestión.
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.jwtService.getRefreshToken();
    console.log("refresh: ", refreshToken);
    return this.http.post<{ accessToken: string }>(`${environment.api_url}/users/refresh-token`, { token: refreshToken })
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor al intentar renovar el token:', response);
        }),
        map(response => {
          this.jwtService.saveToken(response.accessToken); // Guardar el nuevo Access Token
          console.log("acccess: ",response.accessToken);
          return response.accessToken; // Devuelve el nuevo Access Token
        }),
        catchError(error => {
          console.error('Error al renovar el token:', error);
          return throwError(error);
        })
      );
  }
}
