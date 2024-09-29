import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filters } from '../../core/models/filters.model';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  search_value: string | undefined = '';
  listJobs: Job[] = [];
  filters: Filters = new Filters();
  routeFilters!: string | null;
  search: any;

  constructor(
    private JobService: JobService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location) {this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');}

  ngOnInit() {
    // Si hay filtros en la URL, los decodifica y los asigna al objeto `filters`.
    // También establece el valor del input de búsqueda si el filtro de nombre está presente.
    if (this.routeFilters !== null) {
      console.log('dentro');
      this.filters = JSON.parse(atob(this.routeFilters));
    }
    this.search_value = this.filters.name || undefined;
    // console.log(this.search_value);
  }

  // type_event() --> se ejecuta cada vez que el usuario escribe en el campo de búsqueda.
  //  * Actualiza los filtros y emite un evento de búsqueda, además de actualizar la URL con los filtros.
  //  * Si se escribe algo en el campo de búsqueda, se invoca `getListJobs()` para obtener una lista de trabajos.
  public type_event(writtingValue: any): void {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    this.search = writtingValue;
    this.filters.name = writtingValue;

      setTimeout(() => {

          this.searchEvent.emit(this.filters);
          this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));

        if (this.search.length != 0){  
          this.getListJobs()
      }
    }, 150);
    this.filters.name = this.search;
    this.filters.offset = 0;
  }


    // getListJobs() --> llama al servicio `JobService` para obtener trabajos basados en el valor de búsqueda.
    // * Actualiza la lista `listJobs` con los trabajos obtenidos de la respuesta.
    // * Si no se reciben trabajos, imprime un mensaje de error en la consola.
    getListJobs() {
      this.JobService.find_job_name(this.search).subscribe(
        (data: any) => {
          this.listJobs = data.jobs;
          console.log(this.listJobs);
          if(data === null ){
            console.log('error')
          }
        });
     
    }

    //   search_event()--> se ejecuta cuando se confirma la búsqueda.
    //  * Navega a la ruta `/shop/` con los filtros aplicados en la URL.
    public search_event(data: any): void {
      if (typeof data.search_value === 'string') {
        this.filters.name = data.search_value;
        this.filters.offset = 0;
        this.Router.navigate(['/shop/' + btoa(JSON.stringify(this.filters))]);
        // console.log(this.filters);
      }
    }
}
