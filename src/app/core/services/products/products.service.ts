import { Injectable } from '@angular/core';
import { Products } from '../../models/products';
import { GetProduct } from '../../models/get-product';
import { CreateProduct } from '../../models/create-product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor() { }
  private productKey='products'
  public getProducts():GetProduct[]{
    return JSON.parse(localStorage.getItem(this.productKey) || '[]')
  }
  
  public AddProducts(product:CreateProduct){
    const products=this.getProducts();
    product.productId=products.length>0?products[products.length-1].productId+1:1;
    products.push(product);
    localStorage.setItem(this.productKey,JSON.stringify(products))
  }

  public updateProduct(updateProduct:Products){
    const products=this.getProducts();
    const index=products.findIndex((product)=>product.productId===updateProduct.productId);
    if(index!==-1){
      products[index]=updateProduct;
      localStorage.setItem(this.productKey,JSON.stringify(products));
    }
  }

  public deleteProduct(deleteProductID:number){
    const products=this.getProducts().filter((product)=>product.productId!==deleteProductID)
    localStorage.setItem(this.productKey,JSON.stringify(products))
  }
}
