import { Injectable } from '@angular/core';
import { GetProduct } from '../../models/products/get-product';
import { CreateProduct } from '../../models/products/create-product';
import { UpdateProduct } from '../../models/products/update-product';
import { CartProducts } from '../../models/cart/cart-products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor() { }
  private productKey = 'products'
  public getProducts(): GetProduct[] {
    return JSON.parse(localStorage.getItem(this.productKey) || '[]')
  }

  public AddProducts(product: CreateProduct) {
    const products = this.getProducts();
    product.productId = products.length > 0 ? products[products.length - 1].productId + 1 : 1;
    products.push(product);
    localStorage.setItem(this.productKey, JSON.stringify(products))
  }

  public updateProduct(updateProduct: UpdateProduct) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.productId === updateProduct.productId);
    if (index !== -1) {
      products[index] = updateProduct;
      localStorage.setItem(this.productKey, JSON.stringify(products));
    }
  }

  public deleteProduct(deleteProductID: number) {
    const products = this.getProducts().filter((product) => product.productId !== deleteProductID)
    localStorage.setItem(this.productKey, JSON.stringify(products))
  }

  public updateStockAfterPurchase(cartItems: CartProducts[]) {
    const products = this.getProducts();
    cartItems.forEach((cartItem) => {
      const index = products.findIndex(
        (p) => p.productId === cartItem.productId
      );
      if (index !== -1) {
        products[index].productQuantity -= cartItem.quantity;
        if (products[index].productQuantity < 0) {
          products[index].productQuantity = 0;
        }
      }
    });
    localStorage.setItem(this.productKey, JSON.stringify(products));
  }
}
