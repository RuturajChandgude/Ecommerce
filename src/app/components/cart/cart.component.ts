import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CartProducts } from '../../core/models/cart/cart-products';
import { MatIconModule } from '@angular/material/icon';
import { OrdersService } from '../../core/services/orders/orders.service';
@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: CartProducts[] = [];
  public currentUser= JSON.parse(localStorage.getItem('currentUser') || '[]')
  constructor(private cartService: CartService, private productService: ProductsService,private orderService:OrdersService) { }
  ngOnInit() {
    this.loadCart();
  }

  public loadCart() {
    const user=JSON.parse(localStorage.getItem('currentUser') || '[]');
    this.cart = this.cartService.getCartProductByUser(user.userId);
  }

  public removeItem(productid: number) {
    this.cartService.removeFromCart(productid);
    this.loadCart();
  }

  public decreaseQty(item:CartProducts)
  {
    this.cartService.updateQuantity(this.currentUser.userId,item.productId,item.quantity-1);
    this.loadCart()
  }

  public increaseQty(item:CartProducts){
    this.cartService.updateQuantity(this.currentUser.userId,item.productId,item.quantity+1);
    this.loadCart()
  }

  public clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  public totalAmount(): number {
    return this.cartService.getTotalAmountCart();
  }

  public buyNow() {
    this.orderService.buyNow(this.currentUser.userId)
    this.productService.updateStockAfterPurchase(this.cart);
    alert('Order placed!');
    this.clearCart();
  }
}
