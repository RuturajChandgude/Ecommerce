import { Component,Inject,OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { GetProduct } from '../../../core/models/products/get-product';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CartService } from '../../../core/services/cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-add-bulk-order',
  imports: [MatButtonModule,MatDialogModule, MatCheckboxModule, FormsModule, MatIconModule],
  templateUrl: './add-bulk-order.component.html',
  styleUrl: './add-bulk-order.component.scss',
})
export class AddBulkOrderComponent implements OnInit {
 public products: GetProduct[] = [];
  public qty = 1;
  public selectedProduct: { [key: number]: number } = {};

  isChecked: boolean = false;
  constructor(
    private productService: ProductsService,private cartService: CartService,
    public dialogRef: MatDialogRef<AddBulkOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetProduct[]
  ) {}

  ngOnInit() {
    console.log('Recieved data', this.data);
    this.products = this.productService.getProducts();
  }

  public onCheckBoxChange(productId: number, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedProduct[productId] = 1;
    } else {
      delete this.selectedProduct[productId];
    }
  }

  public increase(productId: number) {
    const allProducts=this.productService.getProducts()
    const selectedProduct=allProducts.find((p)=>p.productId===productId);
    if(!selectedProduct)
    {
      return
    }
    // if(selectedProduct.productQuantity===0)
    // {
    //   alert('Sorry! Product is out of stock');
    //   return;
    // }
    if(this.selectedProduct[productId]>=selectedProduct.productQuantity)
    {
      alert(
        `Only ${selectedProduct.productQuantity} ${selectedProduct.productName} available in stock!`
      );
    }
    else{

      this.selectedProduct[productId]++;
    }
  }
  
  public get selectedCount(): number {
    return Object.keys(this.selectedProduct).length;
  }

  public decrease(productId: number) {
    if (this.selectedProduct[productId] > 1) {
      this.selectedProduct[productId]--;
    } else {
      delete this.selectedProduct[productId];
    }
  }

  public addSelectedToCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.userId;
    Object.keys(this.selectedProduct).forEach((productId) => {
      const product = this.data.find((p) => p.productId === Number(productId));
      if (product) {
        if(product.productQuantity>0)
        {
          this.cartService.addToCart(userId.toString(),product,this.selectedProduct[Number(productId)]);
        }
      }
    });
    this.dialogRef.close();
  }
}
  