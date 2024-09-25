import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service'
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent implements OnInit {

  category: Category[] = [];

  constructor(private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  // TOTES LES CATEGORIES
  getCategories() {
    const params = this.getRequestParams(0,0);
    
    this.CategoryService.all_categories(params).subscribe(
      (data: any) => {
        this.category = data.categories;
        // console.log(this.categories);      
      }
    );
  }

  getRequestParams(offset: number,limit: number): any{
    let params: any = {};

    params[`offset`] = offset;
    params[`limit`] = limit;

    return params;
  }
}
