import { Injectable } from '@angular/core';
import { CartProducts } from '../../models/cart/cart-products';
import { GetProduct } from '../../models/products/get-product';
import { ProductsService } from '../products/products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private productService: ProductsService) { }
  private cartKey = 'carts';
  public productData: GetProduct[] = [];
  public currentUser = JSON.parse(localStorage.getItem('currentUser') || '[]');
  public carts: CartProducts[] = [];

  public getCartProducts(): CartProducts[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  public saveAllCarts(allcarts: CartProducts[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(allcarts));
  }

  public getCartProductByUser(userId: number): CartProducts[] {
    const products = this.productService.getProducts();
    const userCart = this.getCartProducts().filter(
      (c) => Number(c.userId) === userId
    );

    return userCart.map((cartItem) => {
      const product = products.find((p) => p.productId === cartItem.productId);
      if (product) {
        return {
          ...cartItem,
          productName: product.productName,
          productCost: product.productCost,
          productImgUrl: product.productImgUrl,
          total: cartItem.quantity * product.productCost,
        };
      }

      return cartItem;
    });
  }

  public saveCartProducts(cart: CartProducts[], userId: string) {
    let allcarts = this.getCartProducts();
    allcarts = allcarts.filter((item) => item.userId !== userId);
    allcarts.push(...cart);
    this.saveAllCarts(allcarts);
  }

  public addToCart(userId: string, product: GetProduct, qty: number) {
    if (product.productQuantity <= 0) {
      alert('This product is out of stock');
      return;
    }
    let allCarts: CartProducts[] = this.getCartProducts();
    let userCart = allCarts.filter((c) => c.userId === userId);
    const index = userCart.findIndex((item) => Number(item.productId) === Number(product.productId)
    );
    if (index !== -1) {
      if (userCart[index].quantity + qty > product.productQuantity) {
        alert('Not enough stock available');
        return;
      }
      userCart[index].quantity += qty;
      userCart[index].total = userCart[index].quantity * product.productCost;
      userCart[index].productName = product.productName;
      userCart[index].productCost = product.productCost;
      userCart[index].productImgUrl = product.productImgUrl;
    } else {
      if (qty > product.productQuantity) {
        alert('Not enough stock available');
        return;
      }

      const newCartItem: CartProducts = {
        userId: String(userId),
        productId: Number(product.productId),
        productName: product.productName,
        productImgUrl: product.productImgUrl,
        productCost: product.productCost,
        quantity: qty,
        total: qty * product.productCost,
      };
      userCart.push(newCartItem);
    }
    allCarts = allCarts.filter((c) => String(c.userId) !== String(userId));
    allCarts.push(...userCart);
    this.saveAllCarts(allCarts);
  }

  public updateQuantity(userId: string, productId: number, newQty: number) {
   let allCarts = this.getCartProducts();
    let userCart = allCarts.filter((c) => String(c.userId) === String(userId));
    const index = userCart.findIndex((item) => Number(item.productId) === Number(productId)
    );
    const productArray: GetProduct[] = this.productService.getProducts();
    const currProduct: GetProduct | undefined = productArray.find(
      (item) => Number(item.productId) === Number(productId)
    );
    if (!currProduct) {
      alert('Product not found in inventory');
      return;
    }
    if (index !== -1) {
      if (newQty < 1) {
        userCart = userCart.filter(
          (item) => Number(item.productId) !== Number(productId)
        );
      } else {
        if (newQty > currProduct.productQuantity) {
          alert('Not enough stock available');
          return;
        }
        userCart[index].quantity = newQty;
        userCart[index].total = newQty * currProduct.productCost;
        userCart[index].productName = currProduct.productName;
        userCart[index].productCost = currProduct.productCost;
        userCart[index].productImgUrl = currProduct.productImgUrl;
      }

      allCarts = allCarts.filter((c) => String(c.userId) !== String(userId));
      allCarts.push(...userCart);
      this.saveAllCarts(allCarts);
    }
  }

  public removeFromCart(productId: number) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = String(currentUser.userId);


    //const updateCart = this.getCartProductByUser(userId).filter(item => item.productId !== productId)

    // console.log(updateCart, 'update cart');
    // let allCarts = this.getCartProducts();
    // let userCart = allCarts.filter((c) => c.userId !== userId)
    // userCart = userCart.filter(item => item.productId !== productId)
    // allCarts = allCarts.filter(c => c.userId !== userId)
    // console.log(allCarts, 'all carts');
    // console.log(userCart, 'userCart');
    // allCarts.push(...userCart);
    // console.log(allCarts, 'all carts after push');

    // this.saveAllCarts(userCart);

    let allCarts = this.getCartProducts();
    let userCart = allCarts.filter((c) => c.userId === userId);
    userCart = userCart.filter((item) =>item.productId !== productId);
    allCarts = allCarts.filter((c) => String(c.userId) !== userId);
    allCarts.push(...userCart);
    this.saveAllCarts(allCarts);
    //const updateCart=allCarts.filter(item=>!(item.userId===userId && item.productId===productId))
    // this.saveCartProducts(updateCart, userId);
    // console.log('Products removed')
    //this.saveAllCarts(updateCart)
  }

  public clearCart() {
    // const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // const userId = currentUser.userId;
    // const allCarts = this.getCartProducts().filter(item => item.userId !== userId)
    // this.saveCartProducts(allCarts, userId);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = String(currentUser.userId);
    const allCarts = this.getCartProducts().filter(item => item.userId !== userId
    )
    this.saveAllCarts(allCarts);
  }


  public getTotalAmountCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.getCartProductByUser(Number(currentUser.userId)).reduce((sum, item) => sum + item.total,0);
  }

  public getCartTotalCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.getCartProductByUser(Number(currentUser.userId)).length;
  }
}
