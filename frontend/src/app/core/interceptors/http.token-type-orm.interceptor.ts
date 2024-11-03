import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtTypeORMService } from '../services_TypeORM';
import { environment } from '../../../environments/environment';

@Injectable()
export class httpTokenTypeORMInterceptor implements HttpInterceptor {
  constructor(private jwtTypeORMService: JwtTypeORMService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.api_urlTypeORM)) {
      return next.handle(req); // Ignorar si no es la URL correspondiente
    }

    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    };

    const token = this.jwtTypeORMService.getTokenTypeORM();

    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
};