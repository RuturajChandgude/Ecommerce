import { ProductCategory } from "../category/product-category";

export interface GetProduct {
    productId: number,
    productName: string,
    productCategory: ProductCategory,
    productImgUrl: string[],
    productCost: number,
    productQuantity:number,
    weight:number,
    color:string,
    width:number,
    height:number,
    voltage:number
}
