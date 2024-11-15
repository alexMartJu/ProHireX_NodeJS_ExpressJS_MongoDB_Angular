import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtPrismaService } from '../services_Prisma'; 
import { environment } from '../../../environments/environment';

@Injectable()
export class httpTokenPrismaInterceptor implements HttpInterceptor {
  constructor(private jwtPrismaService: JwtPrismaService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.api_urlPrisma)) {
      return next.handle(req); // Ignorar si no es la URL correspondiente
    }
    
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    };

    const token = this.jwtPrismaService.getTokenPrisma();

    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
};