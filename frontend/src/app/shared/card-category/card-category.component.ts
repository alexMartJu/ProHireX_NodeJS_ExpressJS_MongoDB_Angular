import { Component, Input } from '@angular/core';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-card-category',
  templateUrl: './card-category.component.html',
  styleUrl: './card-category.component.css'
})
export class CardCategoryComponent {
  @Input() category: Category = {} as Category;

  constructor() { }

  ngOnInit(): void {  
  }
}
