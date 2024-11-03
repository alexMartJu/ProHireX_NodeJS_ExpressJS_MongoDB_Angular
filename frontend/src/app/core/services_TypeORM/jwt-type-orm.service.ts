import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTypeORMService {

  // Obtener el Access Token
  getTokenTypeORM(): string | null {
    return window.localStorage['accessTokenTypeORM'];
  }

  // Guardar el Access Token
  saveTokenTypeORM(token: String) {
    window.localStorage['accessTokenTypeORM'] = token;
  }

  // Eliminar el Access Token
  destroyTokenTypeORM() {
    window.localStorage.removeItem('accessTokenTypeORM');
  }
}
