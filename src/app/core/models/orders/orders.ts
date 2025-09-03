import { CartProducts } from "../cart/cart-products"

export interface Orders {
    orderId:string,
    userId:string,
    order:CartProducts[],
    orderDate:string | Date
}
