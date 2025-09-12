import { Component, OnInit,AfterViewInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CartProducts } from '../../core/models/cart/cart-products';
import { MatIconModule } from '@angular/material/icon';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyService } from '../../core/services/currency/currency.service';
@Component({
  selector: 'app-cart',
  imports: [CommonModule,MatSnackBarModule,MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {
  public snackBar = inject(MatSnackBar);
  public cart: CartProducts[] = [];
  public newSelectedCurrency:string=''
  public currentUser= JSON.parse(localStorage.getItem('currentUser') || '[]')
  constructor(private router:Router,private currencyService:CurrencyService,
  private cartService: CartService, private productService: ProductsService,private orderService:OrdersService) { }

  ngOnInit() {
    this.loadCart();
    this.currencyService.sharedCurrency$.subscribe(data=>{
      this.newSelectedCurrency=data
    })
    console.log('in cart',this.newSelectedCurrency)
  }
 
  public loadCart() {
    const user=JSON.parse(localStorage.getItem('currentUser') || '[]');
    this.cart = this.cartService.getCartProductByUser(user.userId);
  }

  public removeItem(productid: number) {
    console.log('in remove cart')
    this.cartService.removeFromCart(productid);
    this.loadCart();
  }

  public decreaseQty(item:CartProducts)
  {
    this.cartService.updateQuantity(String(this.currentUser.userId),item.productId,item.quantity-1);
    this.loadCart()
  }

  public increaseQty(item:CartProducts){
    this.cartService.updateQuantity(String(this.currentUser.userId),item.productId,item.quantity+1);
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
    // this.orderService.buyNow(this.currentUser.userId)
    // this.productService.updateStockAfterPurchase(this.cart);
    // alert('Order placed!');
    // this.clearCart();
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const orderSuccess=this.orderService.buyNow(this.currentUser.userId);
    if(orderSuccess)
    {
      this.productService.updateStockAfterPurchase(this.cart)
      // alert('Order placed succesfully')
      this.snackBar.open('Order placed succesfully','Dismiss',{
        duration:3000
      })
      this.loadCart();
    }
    else{
      alert('Failed to fetch the order')
    }
  }

  public shopNow(){
     this.router.navigate(['/productDetails'])
  }
}
