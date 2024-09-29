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

  constructor(private jobService: JobService,
    private ActivatedRoute: ActivatedRoute,
    private CategoryService: CategoryService) {}

  ngOnInit(): void {
    this.slug_Category = this.ActivatedRoute.snapshot.paramMap.get('slug');
      console.log(this.slug_Category);

      if(this.slug_Category !== null) {
        this.get_products_by_cat();
      }else{
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
}
