import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/jobs`;
const URLcat = `${environment.api_url}/categories`;

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  //GET ALL
  get_jobs(): Observable<Job[]> {
    return this.http.get<Job[]>(URL);
  }

  //GET ONE
  get_product(slug: String): Observable<Job> {
    return this.http.get<Job>(`${URL}/${slug}`);
  }

  //GET JOB BY CATEGORY
  getJobsByCategory(slug: String): Observable<Job[]> {
    return this.http.get<Job[]>(`${URLcat}/${slug}/jobs`);
  }

  //FILTERS
  get_products_filter(): Observable<Job[]> {
    return this.http.get<Job[]>(URL);
  }
}