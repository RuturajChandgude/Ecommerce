import { CartProducts } from "../cart/cart-products"

export interface Orders {
    orderId:string,
    userId:string,
    orders:CartProducts[],
    orderDate:string | Date
}
