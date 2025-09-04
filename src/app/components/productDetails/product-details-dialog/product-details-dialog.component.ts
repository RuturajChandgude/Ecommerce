import { Component, Inject,OnInit } from '@angular/core';
import { MatDialog,MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GetProduct } from '../../../core/models/products/get-product';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart/cart.service';
import { ProductsService } from '../../../core/services/products/products.service';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { Reviews } from '../../../core/models/reviews/reviews';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-dialog',
  imports: [CommonModule,MatIconModule,MatCardModule,MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './product-details-dialog.component.html',
  styleUrl: './product-details-dialog.component.scss'
})
export class ProductDetailsDialogComponent implements OnInit {
  public qty = 1;
  public userId:string='';
  public productData!:GetProduct;
  public reviewData:Reviews[]=[];
  public similarProducts:GetProduct[]=[];
  public currentUser=JSON.parse(localStorage.getItem('currentUser') || '[]')
  constructor(private router:Router,private cartService:CartService,private productService:ProductsService,private reviewService:ReviewsService,public dialog:MatDialog,private dialogRef: MatDialogRef<ProductDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: GetProduct) { }

  ngOnInit() {
   this.reviewData= this.reviewService.getReviewByProduct(this.data.productId);
   this.similarProducts=this.productService.getProducts().filter(p=>p.productCategory===this.data.productCategory && p.productId!==this.data.productId)
  }
  public increase() {
    if(this.data.productQuantity==0)
    {
      alert('Sorry! Product is out of stock')
    }
    if (this.qty>=this.data.productQuantity && this.data.productQuantity>0)
    {
      alert(`Only ${this.data.productQuantity} ${this.data.productName} available in stock!`)
    }
    if (this.qty < this.data.productQuantity) {
      this.qty++;
    }
  }

  public decrease() {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  public total(): number {
    return this.qty * this.data.productCost;
  }

  public addToCart() {
    if(!localStorage.getItem('currentUser')){
      alert('Please login to continue');
      this.router.navigate(['/login'])
    }
    const userString=localStorage.getItem('currentUser');
    if(userString)
    {
      const userObject=JSON.parse(userString);
      if(userObject && userObject.userId){
        this.userId=userObject.userId;
        console.log(this.userId)
      }
    }
    this.cartService.addToCart(this.userId,this.data,this.qty);
    this.dialogRef.close();
  }
  
  public getSimilarProduct(product:GetProduct)
  {
    this.dialogRef.close();
    this.dialog.open(ProductDetailsDialogComponent,{
      width:'500px',
      data:product
    })
  }
  
  public deleteReview(reviewId:number){
    this.reviewService.deleteReview(reviewId);
     this.reviewData= this.reviewService.getReviewByProduct(this.data.productId);
  }

  public cancel() {
    this.dialogRef.close()
  }
}
