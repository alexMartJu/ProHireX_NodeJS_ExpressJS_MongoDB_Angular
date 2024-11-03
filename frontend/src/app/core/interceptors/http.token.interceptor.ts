// import { Injectable, Injector } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { JwtService } from '../services';

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(private jwtService: JwtService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const headersConfig: { [key: string]: string } = {  // Aquí se define el tipo
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     };

//     const token = this.jwtService.getToken();

//     if (token) {
//       headersConfig['Authorization'] = `Token ${token}`;
//     }

//     const request = req.clone({ setHeaders: headersConfig });
//     return next.handle(request);
//   }
// }


// -------------------------
// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { JwtService } from '../services';
// import { UserService } from '../services/auth.service';  // Importar UserService para renovar token

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(private jwtService: JwtService, private userService: UserService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const headersConfig: { [key: string]: string } = {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     };

//     const token = this.jwtService.getToken();
//     console.log('Token obtenida en el interceptor:', token);

//     if (token) {
//       headersConfig['Authorization'] = `Token ${token}`;
//     }

//     const request = req.clone({ setHeaders: headersConfig });
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           // Si la respuesta es 401, intentamos renovar el token
//           return this.userService.refreshAccessToken().pipe(
//             switchMap((newToken: string) => {
//               this.jwtService.saveToken(newToken); // Guardamos el nuevo token
//               const clonedRequest = request.clone({
//                 setHeaders: {
//                   Authorization: `Token ${newToken}`
//                 }
//               });
//               return next.handle(clonedRequest); // Reenvía la solicitud con el nuevo token
//             }),
//             catchError((refreshError) => {
//               // Si la renovación del token falla, manejamos el error (ej. redirigir a login)
//               this.jwtService.destroyToken(); // Opcional: borra los tokens si falla la renovación
//               this.jwtService.destroyRefreshToken();
//               return throwError(refreshError);
//             })
//           );
//         } else {
//           return throwError(error);
//         }
//       })
//     );
//   }
// }

// 

// ------------------------------------------
// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { JwtService } from '../services';
// import { UserService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(private jwtService: JwtService, private userService: UserService, private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const headersConfig: { [key: string]: string } = {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     };

//     const token = this.jwtService.getToken();
//     console.log('Token obtenida en el interceptor:', token);

//     // Aquí se configura el token
//     if (token) {
//       headersConfig['Authorization'] = `Token ${token}`; // Usas Token como prefijo
//     }

//     const request = req.clone({ setHeaders: headersConfig });

//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 403) {
//           console.log('Token expirado, intentando renovarlo...');
//           return this.userService.refreshAccessToken().pipe(
//             switchMap((newToken: string) => {
//               console.log('Nuevo token recibido:', newToken);
//               this.jwtService.saveToken(newToken);
//               console.log('Token guardado en localStorage:', this.jwtService.getToken());

//               // Verificar el token en localStorage después de guardarlo
//           // setTimeout(() => {
//           //   console.log('Token en localStorage después de la actualización:', this.jwtService.getToken());
//           // }, 1000);
//           console.log('Local Storage después de la actualización:', localStorage.getItem('accessToken'));

//               // Clona la solicitud y establece el nuevo token
//               const clonedRequest = req.clone({
//                 setHeaders: {
//                   Authorization: `Token ${newToken}` // Mantienes Token aquí
//                 }
//               });

//               console.log('Headers de la solicitud clonada:', clonedRequest.headers);
//               return next.handle(clonedRequest); // Reenvía la solicitud con el nuevo token
//             }),
//             catchError((refreshError) => {
//               console.warn('Error al renovar el token. Redirigiendo al inicio de sesión.');
//               this.jwtService.destroyToken();
//               this.jwtService.destroyRefreshToken();
//               this.router.navigate(['/login']);
//               return throwError(refreshError);
//             })
//           );
//         } else if (error.status === 401) {
//           console.warn('Token inválido. Redirigiendo al inicio de sesión.');
//           this.jwtService.destroyToken();
//           this.jwtService.destroyRefreshToken();
//           this.router.navigate(['/login']);
//         }

//         return throwError(error);
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importa Router para la redirección
import { JwtService } from '../services';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false; // Estado para manejar el proceso de renovación

  constructor(private userService: UserService, private router: Router, private jwtService: JwtService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.startsWith(environment.api_url)) {
      return next.handle(req); // Ignorar si no es la URL correspondiente
    }

    // Obtén el token de acceso desde localStorage
    const accessToken = this.jwtService.getToken();

    let request = req;
    if (accessToken) {
      // Clona la solicitud e incluye el token en los headers
      request = req.clone({
        setHeaders: {
          Authorization: `Token ${accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 403 && !this.isRefreshing) {
          this.isRefreshing = true; // Cambia el estado a "refrescando"

          return this.userService.refreshAccessToken().pipe(
            catchError(err => {
              // Si la renovación del token falla, limpia el localStorage y redirige al login
              this.jwtService.destroyToken(); // Opcional: borra los tokens si falla la renovación
              this.jwtService.destroyRefreshToken();
              this.isRefreshing = false; // Resetea el estado de "refrescando"
              this.router.navigate(['/auth/login']); // Redirige a la página de login
              return throwError(err); // Propaga el error
            }),
            switchMap((newToken: string) => {
              // Si la renovación es exitosa, guarda el nuevo token
              localStorage.setItem('accessToken', newToken);

              // Clona la solicitud original con el nuevo token
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Token ${newToken}`
                }
              });

              // Reintenta la solicitud con el nuevo token
              return next.handle(newRequest).pipe(
                tap(() => {
                  this.isRefreshing = false; // Resetea el estado después de manejar la solicitud
                })
              );
            })
          );
        }
        return throwError(error); // Propaga cualquier otro error
      })
    );
  }
}
