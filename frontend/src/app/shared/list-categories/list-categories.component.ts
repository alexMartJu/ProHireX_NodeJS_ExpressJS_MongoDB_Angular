import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service'
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent implements OnInit {

  offset = 0;
  limit = 3;

  category: Category[] = [];

  constructor(private CategoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  // TOTES LES CATEGORIES
  getCategories() {
    const params = this.getRequestParams(this.offset, this.limit);
    
    this.CategoryService.all_categories(params).subscribe(
      (data: any) => {
        this.category = data.categories;
        this.limit = this.limit + 3;
        // console.log(this.categories);
        console.log(this.limit);       
      }
    );
  }

  getRequestParams(offset: number,limit: number): any{
    let params: any = {};

    params[`offset`] = offset;
    params[`limit`] = limit;

    return params;
  }

  scroll() {
    this.getCategories();
  }
}
