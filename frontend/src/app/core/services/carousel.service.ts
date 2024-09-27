import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarouselDetails, CarouselHome } from '../models/carousel.model';
import { environment } from '../../../environments/environment';

const URL = `${environment.api_url}/carousel`;

@Injectable({
  providedIn: 'root'
})

export class CarouselService {

  constructor(private http: HttpClient) { }

  getCarouselHome(): Observable<CarouselHome[]> {    
    return this.http.get<CarouselHome[]>(URL);
  }

  getCarouselDetails(slug: String| null): Observable<CarouselDetails[]> {    
    return this.http.get<CarouselDetails[]>(`${URL}/${slug}`);
  }
}
