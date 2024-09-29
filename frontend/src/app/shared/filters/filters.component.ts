import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { Filters } from '../../core/models/filters.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Input() listCategories: Category[] = [];
  @Output() eventofiltros: EventEmitter<Filters> = new EventEmitter();

  constructor() {}

  ngOnInit() : void {}
}
