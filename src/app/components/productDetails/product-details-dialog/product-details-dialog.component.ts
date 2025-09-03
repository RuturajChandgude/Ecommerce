import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GetProduct } from '../../../core/models/products/get-product';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart/cart.service';
import { Users } from '../../../core/models/users/users';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { Reviews } from '../../../core/models/reviews/reviews';
@Component({
  selector: 'app-product-details-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './product-details-dialog.component.html',
  styleUrl: './product-details-dialog.component.scss'
})
export class ProductDetailsDialogComponent implements OnInit {
  public qty = 1;
  public userId:string=''
  public productData!:GetProduct
  public reviewData:Reviews[]=[]
  constructor(private cartService:CartService,private reviewService:ReviewsService,private dialogRef: MatDialogRef<ProductDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: GetProduct) { }

  ngOnInit() {
   this.reviewData= this.reviewService.getReviewByProduct(this.data.productId)
  }
  public increase() {
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

  public cancel() {
    this.dialogRef.close()
  }
}
