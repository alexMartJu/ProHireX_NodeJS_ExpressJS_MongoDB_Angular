import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/categories`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  all_categories(params: any): Observable<Category[]> {
    return this.http.get<Category[]>(URL , {params});
  }
}

export type { Category };
