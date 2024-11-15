import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';
import { Filters } from '../models/filters.model';

const URL = `${environment.api_url}/jobs`;
const URLcat = `${environment.api_url}/categories`;
const URLfav = `${environment.api_url}`;

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
  getJobsByCategory(slug: String, filters: Filters): Observable<Job[]> {
    return this.http.get<Job[]>(`${URLcat}/${slug}/jobs?limit=${filters.limit}&offset=${filters.offset}`);
  }

  //FILTERS
  get_products_filter(filters : Filters): Observable<Job[]> {
    let params = {};
    params = filters;
    return this.http.get<Job[]>(URL, {params});
  }

  //SEARCH
  find_job_name(search: string): Observable<any> {
    return this.http.get<Job>(`${URL}?name=${search}`).pipe(
        map((data) => {
        return data;
        })
    );
  }

  favorite(slug: String): Observable<any> {
    return this.http.post(`${URLfav}/${slug}/favorite`, {})
  }

  unfavorite(slug: String): Observable<any> {
    return this.http.delete(`${URLfav}/${slug}/favorite`)
  }
}