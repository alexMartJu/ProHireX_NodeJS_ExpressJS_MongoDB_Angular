import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { httpTokenPrismaInterceptor } from './interceptors/http.token-prisma.interceptor';
import { httpTokenTypeORMInterceptor } from './interceptors';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: httpTokenPrismaInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: httpTokenTypeORMInterceptor, multi: true }
  ]
})
export class CoreModule { }
