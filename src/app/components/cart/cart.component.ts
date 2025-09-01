import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CartProducts } from '../../core/models/cart/cart-products';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: CartProducts[] = [];
  constructor(private cartService: CartService, private productService: ProductsService) { }
  ngOnInit() {
    this.loadCart();
  }

  public loadCart() {
    this.cart = this.cartService.getCartProducts();
  }

  public removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  public clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  public totalAmount(): number {
    return this.cartService.getTotalAmountCart();
  }

  public buyNow() {
    this.productService.updateStockAfterPurchase(this.cart);
    alert('Order placed!');
    this.clearCart();
  }
}
