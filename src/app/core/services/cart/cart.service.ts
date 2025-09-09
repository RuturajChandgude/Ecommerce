import { Injectable } from '@angular/core';
import { CartProducts } from '../../models/cart/cart-products';
import { GetProduct } from '../../models/products/get-product';
import { ProductsService } from '../products/products.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private productService: ProductsService) { }
  private cartKey = 'carts';
  public productData: GetProduct[] = []
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '[]')
  public carts: CartProducts[] = [];
  count :number=0
  public getCartProducts(): CartProducts[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]')
  }

  public saveAllCarts(allcarts: CartProducts[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(allcarts))
  }

  public getCartProductByUser(userId: number): CartProducts[] {
    this.count++
    const products = this.productService.getProducts();
    console.log(products,'all products')
    const userCart = this.getCartProducts().filter(c => Number(c.userId) === userId)
    if(userCart)
    {
      console.log(userCart,'usercart is avaialable')
    }
    //console.log(userCart, 'usercart', userId)

     return userCart.map(cartItem => {
      const product = products.find(p => p.productId === cartItem.productId);
      console.log(product, 'products',this.count)
      if (product) {
        return {
          ...cartItem,
          productName: product.productName,
          productCost: product.productCost,
          productImgUrl: product.productImgUrl,
          total: cartItem.quantity * product.productCost
        }
      }
      console.log(cartItem,'cartItem')
      return cartItem
    })
    //console.log(userCart,'userCart')
   // return userCart
  }

  public saveCartProducts(cart: CartProducts[], userId: string) {
    let allcarts = this.getCartProducts();
    allcarts = allcarts.filter(item => item.userId !== userId);
    allcarts.push(...cart);
    this.saveAllCarts(allcarts);
  }

  public addToCart(userId: string, product: GetProduct, qty: number) {
    if (product.productQuantity <= 0) {
      alert('This product is out of stock');
      return;
    }
    const userCart = this.getCartProductByUser(Number(userId));

    console.log(userCart, 'cart product by user ')
    const index = userCart.findIndex((item) => Number( item.productId) === Number(product.productId));
    console.log(index, 'index')
    if (index !==-1) {
      if (userCart[index].quantity + qty > product.productQuantity) {
        alert('Not enough stock available');
        return;
      }
      userCart[index].quantity += qty;
      userCart[index].total = userCart[index].quantity * userCart[index].productCost;
    }
    else {
      if (qty > product.productQuantity) {
        alert('Not enough stock available');
        return;
      }

      userCart.push({
        userId: userId,
        productId: product.productId,
        productName: product.productName,
        productImgUrl: product.productImgUrl,
        productCost: product.productCost,
        quantity: qty,
        total: qty * product.productCost
      })
    }

    this.saveCartProducts(userCart, userId);
  }

  public updateQuantity(userId: string, productId: number, newQty: number) {
    const userCart = this.getCartProductByUser(Number(userId));
    const index = userCart.findIndex(item => item.productId === productId);

    const productArray: GetProduct[] = this.productService.getProducts();
    const currProduct: GetProduct | undefined = productArray.find(item => item.productId === productId)

    if (!currProduct) {
      alert('Product not found in inventory');
      return;
    }

    if (index !== -1) {
      if (newQty < 1) {
        this.removeFromCart(productId)
      } else {
        if (newQty > currProduct.productQuantity) {
          alert('Not enough stock available');
          return;
        }
        userCart[index].quantity = newQty;
        userCart[index].total = newQty * userCart[index].productCost;
      }
      this.saveCartProducts(userCart, userId);
    }
  }

  public removeFromCart(productId: number) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.userId;
     const updateCart = this.getCartProductByUser(userId).filter(item => item.productId !== productId)

    // console.log(updateCart, 'update cart');
    //let allCarts=this.getCartProducts();

    //const updateCart=allCarts.filter(item=>!(item.userId===userId && item.productId===productId))
    this.saveCartProducts(updateCart, userId);
    console.log('Products removed')
    //this.saveAllCarts(updateCart)
  }

  public clearCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.userId;
    const allCarts = this.getCartProducts().filter(item => item.userId !== userId)
    this.saveCartProducts(allCarts, userId);
  }

  public getTotalAmountCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.getCartProductByUser(currentUser.userId).reduce((sum, item) => sum = sum + item.total, 0);
  }

  public getCartTotalCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.getCartProductByUser(currentUser.userId).length
  }
}
