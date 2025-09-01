import { Injectable } from '@angular/core';
import { CartProducts } from '../../models/cart/cart-products';
import { GetProduct } from '../../models/products/get-product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor() { }
  private cartKey='cart';
  
  public getCartProducts():CartProducts[]{
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]')
  }

  public saveCartProducts(cart:CartProducts[]){
    localStorage.setItem(this.cartKey,JSON.stringify(cart));
  }

  public addToCart(product:GetProduct,qty:number){
    if(product.productQuantity<=0){
      alert('This product is out of stock');
      return;
    }
    const cart=this.getCartProducts();
    const index=cart.findIndex((item)=>item.productId===product.productId);

    if(index!==-1){
      if(cart[index].quantity+qty>product.productQuantity){
        alert('Not enough stock available');
        return;
      }
      cart[index].quantity+=qty;
      cart[index].total=cart[index].quantity*cart[index].productCost;
    }
    else{
      if(qty>product.productQuantity)
      {
        alert('Not enough stock available');
        return;
      }
      // const storedData=(localStorage.getItem('currentUser'));
      // const userData=JSON.parse(this.storedData);
      cart.push({
        
        productId:product.productId,
        productName:product.productName,
        productImgUrl:product.productImgUrl,
        productCost:product.productCost,
        quantity:qty,
        total:qty*product.productCost
      })
    }
    this.saveCartProducts(cart);
  }

  public removeFromCart(productId:number){
    const cart=this.getCartProducts().filter((item)=>item.productId!==productId);
    this.saveCartProducts(cart);
  }

  public clearCart(){
    localStorage.removeItem(this.cartKey);
  }

  public getTotalAmountCart(){
    return this.getCartProducts().reduce((sum,item)=>sum=sum+item.total,0);
  }

  public getCartTotalCount(){
    return this.getCartProducts().reduce((sum,item)=>sum+item.quantity,0);
  }
}
