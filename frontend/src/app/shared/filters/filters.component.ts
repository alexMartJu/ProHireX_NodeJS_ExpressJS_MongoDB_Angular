import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { Filters } from '../../core/models/filters.model';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Input() listCategories: Category[] = [];
  @Output() eventofiltros: EventEmitter<Filters> = new EventEmitter();

  routeFilters: string | null = null;
  filters!: Filters
  id_cat: string = "";
  price_max: number | undefined;
  price_min: number | undefined;

  constructor(private ActivatedRoute: ActivatedRoute, private Router: Router, private Location: Location) { this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters'); }

  ngOnInit(): void {
    this.ActivatedRoute.snapshot.paramMap.get('filters') != undefined ? this.Highlights() : "";
    // console.log(this.ActivatedRoute.snapshot.paramMap.get('filters'));
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
  }

  // Filter_products() --> procesa los filtros aplicados y genera una URL con los filtros codificados.
  // Si hay filtros en la ruta, los decodifica y los asigna. Luego emite el evento con los filtros actualizados.
  public filter_products() {

    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    console.log(this.routeFilters);

    // Si hay filtros en la URL, los decodifica y asigna a `this.filters`.
    if (this.routeFilters != null) {
      this.filters = new Filters();
      this.filters = JSON.parse(atob(this.routeFilters));
      console.log(this.filters.category);
    } else {
      this.filters = new Filters();
    }
    // Si existe una categoría seleccionada, la asigna al filtro.
    if (this.id_cat) {
      this.filters.category = this.id_cat;
    }

    // Actualiza los precios mínimos y máximos aplicados, si existen.
    this.price_calc(this.price_min, this.price_max);
    this.filters.price_min = this.price_min ? this.price_min : undefined;
    this.filters.price_max = this.price_max == 0 || this.price_max == null ? undefined : this.price_max;

    // Después de un breve retardo, actualiza la URL con los filtros codificados y emite el evento.
    setTimeout(() => {
      this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
      this.eventofiltros.emit(this.filters);
    }, 200);

  }

  // price_calc() --> Este método verifica y ajusta los valores de `price_min` y `price_max`.
  // Asegura que el precio mínimo no sea mayor que el máximo, y lo corrige si es necesario.
  public price_calc(price_min: number | undefined, price_max: number | undefined) {
    if (typeof price_min == 'number' && typeof price_max == 'number') {
      if (price_min > price_max) {
        this.price_min = price_min;
        this.price_max = undefined;
      } else {
        this.price_min = price_min;
        this.price_max = price_max;
      }
    }
  }

  // remove_filters()--> resetea los filtros aplicados y redirige al usuario a la página principal de la shop sin filtros.
  public remove_filters() {
    window.location.assign("http://localhost:4200/shop")
    this.filters.category && this.id_cat === "";
    this.filters.price_min = undefined;
    this.filters.price_max = undefined;
  }

  // Hightlights()--> Este método actualiza los valores destacados (como categoría y precio) según los filtros en la URL.
  // Lo utiliza para mantener la UI sincronizada con los filtros que vienen desde la URL.
  Highlights() {
    let routeFilters = JSON.parse(atob(this.ActivatedRoute.snapshot.paramMap.get('filters') || ''));

    if (routeFilters.search == undefined) {
      this.id_cat = routeFilters.category || '';
      this.price_min = routeFilters.price_min;
      this.price_max = routeFilters.price_max;
    }
  }
}
