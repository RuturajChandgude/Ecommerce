import { Component, OnInit } from '@angular/core';
import { Orders } from '../../../core/models/orders/orders';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddReviewsComponent } from '../add-reviews/add-reviews.component';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
@Component({
  selector: 'app-orderhistory',
  imports: [MatCardModule, CommonModule,MatButtonModule,MatDialogModule],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.scss'
})
export class OrderhistoryComponent implements OnInit {
  public orders: Orders[] = [];
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  constructor(private orderService: OrdersService,private reviewService:ReviewsService,private dialog: MatDialog) { }

  ngOnInit() {
    if (this.currentUser.userId) {
      this.orders = this.orderService.getOrderByUser(this.currentUser.userId);
    }
  }

  public addReview(productId:number)
  {
    const dialogRef=this.dialog.open(AddReviewsComponent,{
      width:'400px',
      height:'350px',
    })
    dialogRef.afterClosed().subscribe(review=>{
      if(review)
      {
        console.log(typeof(review.productReview));
        this.reviewService.AddReviews(review.productReview,review.rating,productId)
      }
    })
  }

}
