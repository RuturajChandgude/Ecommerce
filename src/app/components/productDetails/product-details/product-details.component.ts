import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GetProduct } from '../../../core/models/products/get-product';
import { ProductsService } from '../../../core/services/products/products.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from '../product-details-dialog/product-details-dialog.component';
@Component({
  selector: 'app-product-details',
  imports: [MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  public productsData!: GetProduct[];

  constructor(private productService: ProductsService, private dialog: MatDialog) { }

  ngOnInit() {
    const storedData = localStorage.getItem('products');
    if (storedData) {
      this.productsData = JSON.parse(storedData)
    }
  }

  public openProductDetailsDialog(product: GetProduct) {
    this.dialog.open(ProductDetailsDialogComponent, {
      width: '500px',
      data: product,
    })
  }
}
