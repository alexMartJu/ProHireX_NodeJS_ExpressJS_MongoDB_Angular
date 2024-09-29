import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filters } from '../../core/models/filters.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();
  
  constructor() {}

  ngOnInit() {}
}
