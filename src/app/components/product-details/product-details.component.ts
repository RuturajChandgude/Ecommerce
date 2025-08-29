import { Component ,OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { GetProduct } from '../../core/models/get-product';
import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-product-details',
  imports: [MatButtonModule,MatCardModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
public productsData!:GetProduct[];

constructor(private productService:ProductsService){}

ngOnInit() {
  const storedData=localStorage.getItem('products');
  if(storedData){
    this.productsData=JSON.parse(storedData)
  }
}
}
