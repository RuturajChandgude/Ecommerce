import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetProduct } from '../../../core/models/products/get-product';
import { CartService } from '../../../core/services/cart/cart.service';
import { ProductsService } from '../../../core/services/products/products.service';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { Reviews } from '../../../core/models/reviews/reviews';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyService } from '../../../core/services/currency/currency.service';
@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss'],
})
export class ProductDetailsPageComponent implements OnInit {
  public qty = 1;
  public allProductArray:GetProduct[]=[]
  public productData!: GetProduct;
  public reviewData: Reviews[] = [];
  public similarProducts: GetProduct[] = [];
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '[]');
  public productId!: number
  public newSelectedCurrency:string='';
  constructor(
    private route: ActivatedRoute, private router: Router,
     private cartService: CartService,
    private currencyService:CurrencyService,
    private productService: ProductsService, private reviewService: ReviewsService
  ) { }

  ngOnInit() {
    this.loadProduct();
    this.currencyService.sharedCurrency$.subscribe(data=>{
      this.newSelectedCurrency=data
    })
  }

  public loadProduct() {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      console.log('Current productid', this.productId);
      const allProducts = this.productService.getProducts();
      const foundProduct = allProducts.find((p) => p.productId === this.productId);

      if (!foundProduct) {
        alert('Product not found')
        return;
      }
      this.productData = foundProduct;
      this.reviewData = this.reviewService.getReviewByProduct(this.productId);
      this.similarProducts = allProducts.filter((p) => p.productCategory.productCategory === this.productData.productCategory.productCategory
        && p.productId !== this.productData.productId
      );
    })

  }

  public convertCurrency(price:number):string
  {
    switch(this.newSelectedCurrency)
    {
      case 'USA':
        return `$ ${(price/88.44).toFixed(2)}`;
      case 'France':
        return `€ ${(price/103.66).toFixed(2)}`;
      case 'England':
        return `£ ${(price/119.72).toFixed(2)}`;
      default:
        return `Rs ${price}`
    }
  }

  public increase() {
    if (this.productData.productQuantity === 0) {
      alert('Sorry! Product is out of stock');
      return;
    }
    if (this.qty >= this.productData.productQuantity) {
      alert(
        `Only ${this.productData.productQuantity} ${this.productData.productName} available in stock!`
      );
    } else {
      this.qty++;
    }
  }

  public decrease() {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  public total(): string {
    switch(this.newSelectedCurrency)
    {
      case 'USA':
        return `$ ${(this.qty * this.productData.productCost/88.44).toFixed(2)}`;
      case 'France':
        return `€ ${(this.qty * this.productData.productCost/103.66).toFixed(2)}`;
      case 'England':
        return `£ ${(this.qty * this.productData.productCost/119.72).toFixed(2)}`;
      default:
        return `Rs ${this.qty * this.productData.productCost}`
    }
  }

  public addToCart() {
    if (!localStorage.getItem('currentUser')) {
      alert('Please login to continue');
      this.router.navigate(['/login']);
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.userId
    this.cartService.addToCart(String(userId), this.productData, this.qty);
   
  }

  public getSimilarProduct(product: GetProduct) {
    console.log('new product', product)
    console.log('new product id', product.productId);
    this.router.navigate(['/product', product.productId]);    
  }

  public deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId);
    this.reviewData = this.reviewService.getReviewByProduct(
      this.productData.productId
    );
  }
}