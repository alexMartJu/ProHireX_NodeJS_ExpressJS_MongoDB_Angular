import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  // Obtener el Access Token
  getToken(): string | null {
    return window.localStorage['accessToken'];
  }

  // Guardar el Access Token
  saveToken(token: String) {
    window.localStorage['accessToken'] = token;
  }

  // Eliminar el Access Token
  destroyToken() {
    window.localStorage.removeItem('accessToken');
  }

  // Obtener el Refresh Token
  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  // Guardar el Refresh Token
  saveRefreshToken(token: string) {
    window.localStorage['refreshToken'] = token;
  }

  // Eliminar el Refresh Token
  destroyRefreshToken() {
    window.localStorage.removeItem('refreshToken');
  }
}
