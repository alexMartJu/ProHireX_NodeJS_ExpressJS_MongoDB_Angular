import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtPrismaService {

  // Obtener el Access Token
  getTokenPrisma(): string | null {
    return window.localStorage['accessTokenPrisma'];
  }

  // Guardar el Access Token
  saveTokenPrisma(token: String) {
    window.localStorage['accessTokenPrisma'] = token;
  }

  // Eliminar el Access Token
  destroyTokenPrisma() {
    window.localStorage.removeItem('accessTokenPrisma');
  }
}