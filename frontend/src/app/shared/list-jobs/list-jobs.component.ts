import { Component, OnInit } from '@angular/core';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { Filters } from '../../core/models/filters.model';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrl: './list-jobs.component.css'
})
export class ListJobsComponent implements OnInit {

  job: Job[] = [];
  slug_Category!: string | null;
  listCategories: Category[] = [];
  filters = new Filters();
  routeFilters!: string | null;

  constructor(private jobService: JobService,
    private ActivatedRoute: ActivatedRoute,
    private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.slug_Category = this.ActivatedRoute.snapshot.paramMap.get('slug');
    console.log(this.slug_Category);
    // console.log(this.ActivatedRoute.snapshot.paramMap.get('filters'));
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');

    this.getListForCategory();

    // - Si hay un slug de categoría, obtiene los trabajos filtrados por esa categoría.
    // - Si no hay slug de categoría pero hay filtros en la ruta, actualiza los filtros y obtiene los trabajos filtrados.
    // - Si no hay ni slug de categoría ni filtros, obtiene todos los trabajos disponibles.
    if (this.slug_Category !== null) {
      this.get_products_by_cat();
    } else if (this.routeFilters !== null) {
      this.refreshRouteFilter();
      this.get_list_filtered(this.filters);
    } else {
      this.get_list_filtered(this.filters);
    }
  }

  get_products_by_cat(): void {

    if (this.slug_Category !== null) {
      console.log("entro aqui");
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (data: any) => {
          this.job = data.jobs;
          console.log(data.jobs);
        });
    }
  }

  get_list_filtered(filters: Filters) {
    this.filters = filters;
    console.log("entro aqui2");
    this.jobService.get_products_filter(filters).subscribe(
      (data: any) => {
        this.job = data.jobs;
        console.log(this.job);
      });
  }

  //   getListCategory() --> Obtiene todas las categorías disponibles para la selección.
  //  Llama al servicio CategoryService para obtener la lista de categorías
  //  y almacena la respuesta en la propiedad listCategories.
  getListForCategory() {
    this.CategoryService.all_categories_select().subscribe(
      (data: any) => {
        this.listCategories = data.categories;
      }
    );
  }

  refreshRouteFilter() {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    if (typeof (this.routeFilters) == "string") {
      this.filters = JSON.parse(atob(this.routeFilters));
    } else {
      this.filters = new Filters();
    }
  }
}
