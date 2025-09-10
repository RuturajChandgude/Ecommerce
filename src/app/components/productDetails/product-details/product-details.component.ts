import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GetProduct } from '../../../core/models/products/get-product';
import { ProductsService } from '../../../core/services/products/products.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { Reviews } from '../../../core/models/reviews/reviews';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-details',
  imports: [MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  public productsData!: GetProduct[];
  public reviewData!:Reviews[]
  constructor(private router:Router,private productService: ProductsService,private reviewService:ReviewsService,private dialog: MatDialog) { }

  ngOnInit() {
    const storedData = localStorage.getItem('products');
    if (storedData) {
      this.productsData = JSON.parse(storedData)
    }
  }

  public openProductDetails(product: GetProduct) {
    this.router.navigate(['/product', product.productId]);
  }
}
