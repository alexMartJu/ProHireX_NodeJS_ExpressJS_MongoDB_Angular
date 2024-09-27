import { Component, Input, OnInit } from '@angular/core';
import { CarouselDetails, CarouselHome } from '../../core/models/carousel.model';

@Component({
  selector: 'app-carousel-items',
  templateUrl: './carousel-items.component.html',
  styleUrl: './carousel-items.component.css'
})
export class CarouselItemsComponent implements OnInit {

  @Input() categories!: CarouselHome[];
  @Input() jobs_details!: CarouselDetails[];
  @Input() page!: String;
  

  selectIndex = 0;
  selectIndex_product_img = 0;

  constructor(){}
  
  ngOnInit(): void {
  }
}
