import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GetProduct } from '../../../core/models/products/get-product';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart/cart.service';
@Component({
  selector: 'app-product-details-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './product-details-dialog.component.html',
  styleUrl: './product-details-dialog.component.scss'
})
export class ProductDetailsDialogComponent {
  public qty = 1;
  constructor(private cartService:CartService,private dialogRef: MatDialogRef<ProductDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: GetProduct) { }

  public increase() {
    if (this.qty < this.data.productQuantity) {
      this.qty++;
    }
  }

  public decrease() {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  public total(): number {
    return this.qty * this.data.productCost;
  }

  public addToCart() {
    this.cartService.addToCart(this.data,this.qty);
    this.dialogRef.close();
  }

  public cancel() {
    this.dialogRef.close()
  }
}
