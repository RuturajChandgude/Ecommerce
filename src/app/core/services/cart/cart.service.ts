import { Injectable } from '@angular/core';
import { CartProducts } from '../../models/cart/cart-products';
import { GetProduct } from '../../models/products/get-product';
import { ProductsService } from '../products/products.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private productService:ProductsService) { }
  private cartKey='cart';
  public productData:GetProduct[]=[]
  public currentUser= JSON.parse(localStorage.getItem('currentUser') || '[]')
  public getCartProducts():CartProducts[]{
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]')
  }

  public getCartProductByUser(userId:number):CartProducts[]{
  const cartData=localStorage.getItem(`${this.cartKey}_${userId}`);
  return cartData?JSON.parse(cartData):[]
  }

  public saveCartProducts(cart:CartProducts[],userId:string){
    localStorage.setItem(`${this.cartKey}_${userId}`,JSON.stringify(cart))
  }

  public addToCart(userId:string,product:GetProduct,qty:number){
    if(product.productQuantity<=0){
      alert('This product is out of stock');
      return;
    }
    const cart=this.getCartProductByUser(Number(userId));
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
   
      cart.push({
        userId:userId,
        productId:product.productId,
        productName:product.productName,
        productImgUrl:product.productImgUrl,
        productCost:product.productCost,
        quantity:qty,
        total:qty*product.productCost
      })
    }
    this.saveCartProducts(cart,userId);
  }

  public updateQuantity(userId:string,productId:number,newQty:number)
  {
    const cart=this.getCartProductByUser(Number(userId));
    const index=cart.findIndex(item=>item.productId===productId);

    const productArray:GetProduct[]=this.productService.getProducts();
    const currProduct:GetProduct | undefined=productArray.find(item=>item.productId===productId)
    
    if(!currProduct)
    {
      alert('Product not found in inventory');
      return;
    }
    //const currProduct=this.productService.getProducts.find((item)=>item.productId==productId)
    if(index!==-1)
    {
      if(newQty<1)
      {
        this.removeFromCart(productId)
      }else{
        if(newQty>currProduct.productQuantity)
        {
          alert('Not enough stock available');
          return;
        }
        cart[index].quantity=newQty;
        cart[index].total=newQty*cart[index].productCost;
      }
      this.saveCartProducts(cart,userId);
    }
  }
  
  public removeFromCart(productId:number){
    const cart=this.getCartProductByUser(this.currentUser.userId).filter((item)=>item.productId!==productId);
    this.saveCartProducts(cart,this.currentUser.userId);
  }

  public clearCart(){
    localStorage.removeItem(`${this.cartKey}_${this.currentUser.userId}`);
  }

  public getTotalAmountCart(){
    return this.getCartProductByUser(this.currentUser.userId).reduce((sum,item)=>sum=sum+item.total,0);
  }

  public getCartTotalCount(){
    //return this.getCartProductByUser(this.currentUser.userId).reduce((sum,item)=>sum+item.quantity,0);
    return this.getCartProductByUser(this.currentUser.userId).length
  }
}
