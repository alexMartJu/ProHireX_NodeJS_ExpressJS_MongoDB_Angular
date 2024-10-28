import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiPrismaService {

  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    // console.log('POST to:', `${environment.api_url}${path}`);
    // console.log('Body:', params);
    return this.http.get(`${environment.api_urlPrisma}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    // console.log('POST to:', `${environment.api_url}${path}`);
    // console.log('Body:', body);
    // console.log('Body:', JSON.stringify(body));
    return this.http.put(
      `${environment.api_urlPrisma}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    // console.log('POST to:', `${environment.api_url}${path}`);
    // console.log('Body:', body);
    return this.http.post(
      `${environment.api_urlPrisma}${path}`,
      body
    ).pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<any> {
    return this.http.delete(
      `${environment.api_urlPrisma}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}