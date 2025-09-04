import { Injectable } from '@angular/core';
import { Reviews } from '../../models/reviews/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  public currentUser=JSON.parse(localStorage.getItem('currentUser') || '[]');
  public reviews:Reviews[]=[];
  constructor() {}
  
  public loadReviews():Reviews[]{
    return JSON.parse(localStorage.getItem('reviews') || '[]');
  }

  public saveReviews(){
    localStorage.setItem('reviews',JSON.stringify(this.reviews))
  }
   
  public AddReviews(reviewText:string,rating:string,productId:number){
    const newReview={
      reviewId:Date.now(),
      reviewText:reviewText,
      rating:rating,
      userId:this.currentUser.userId,
      userName:this.currentUser.name,
      productId:productId
    }
    this.reviews.push(newReview);
    this.saveReviews();
  } 

  public getReviewByProduct(productId:number){
    const reviews=this.loadReviews()
    return reviews.filter(review=>review.productId===productId)
  }

  public deleteReview(deleteReviewId:number){
    const reviews=this.loadReviews().filter(review=>review.reviewId!=deleteReviewId);
    localStorage.setItem('reviews',JSON.stringify(reviews));
  }

}
