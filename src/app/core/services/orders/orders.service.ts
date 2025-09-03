import { Injectable ,OnInit} from '@angular/core';
import { Orders } from '../../models/orders/orders';
import { GetProduct } from '../../models/products/get-product';
import { CartService } from '../cart/cart.service';
@Injectable({
  providedIn: 'root'
})
export class OrdersService{
  private orderKey='orders';
  public orders:Orders[]=[]
  constructor(private cartService:CartService) {
    const data=localStorage.getItem(this.orderKey);
    this.orders=data?JSON.parse(data):[];
   }

  public loadOrders(){
    const data=localStorage.getItem(this.orderKey);
    this.orders=data?JSON.parse(data):[];
  }

  public saveOrder(){
    localStorage.setItem(this.orderKey,JSON.stringify(this.orders));
  }

  public buyNow(userId:string)
  {
    const cart=this.cartService.getCartProductByUser(Number(userId));
    const newOrder={
      orderId:Date.now().toString(),
      userId:userId,
      order:cart,
      orderDate:new Date().toISOString()
    }
    this.orders.push(newOrder);
     this.saveOrder();
     this.cartService.clearCart()

  }

  public getOrderByUser(userId:string)
  {
    return this.orders.filter(order=>order.userId===userId);
  }
}
