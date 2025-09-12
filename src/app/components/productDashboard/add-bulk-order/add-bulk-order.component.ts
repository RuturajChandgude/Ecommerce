import { Component,Inject, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { GetProduct } from '../../../core/models/products/get-product';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CartService } from '../../../core/services/cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-bulk-order',
  imports: [MatButtonModule,MatSnackBarModule, MatTableModule, MatDialogModule, MatCheckboxModule, FormsModule, MatIconModule],
  templateUrl: './add-bulk-order.component.html',
  styleUrl: './add-bulk-order.component.scss',
})
export class AddBulkOrderComponent implements OnInit {
  public products: GetProduct[] = [];
  public qty = 1;
  public selectedProduct: { [key: number]: number } = {};
  public dataSource = new MatTableDataSource<GetProduct>();
  public displayedColumns: string[] = ['select', 'productCategory', 'productCost', 'productQuantity','quantity']
  public isChecked: boolean = false;
  public newSelectedCurrency:string='';
  public snackBar = inject(MatSnackBar);
  constructor(
    private productService: ProductsService, private cartService: CartService,
    private currencyService:CurrencyService,
    public dialogRef: MatDialogRef<AddBulkOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetProduct[]
  ) { }

  ngOnInit() {
    console.log('Recieved data', this.data);
    this.products = this.productService.getProducts();
    this.loadProducts()
    this.currencyService.sharedCurrency$.subscribe(data=>{
      this.newSelectedCurrency=data
    })
  }

  public onCheckBoxChange(productId: number, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedProduct[productId] = 1;
    } else {
      delete this.selectedProduct[productId];
    }
  }
  
  public loadProducts() {
    const productData = this.productService.getProducts();
    if (productData) {
      this.dataSource.data = productData;
    }
  }

  public convertCurrency(price:number):string
  {
    switch(this.newSelectedCurrency)
    {
      case 'USA':
        return `$ ${(price/88.44).toFixed(2)}`;
      case 'France':
        return `€ ${(price/103.66).toFixed(2)}`;
      case 'England':
        return `£ ${(price/119.72).toFixed(2)}`;
      default:
        return `Rs ${price}`
    }
  }
  
  public increase(productId: number) {
    if(!this.selectedProduct[productId])
    {
      this.snackBar.open('Please select the product first','Dismiss',{
        duration:2000
      })
    }
    const allProducts = this.productService.getProducts()
    const selectedProduct = allProducts.find((p) => p.productId === productId);
    if (!selectedProduct) {
      return
    }
    
    if (this.selectedProduct[productId] >= selectedProduct.productQuantity  && selectedProduct.productQuantity===0) {
      alert('Product is out of stock');
    }

    else if (this.selectedProduct[productId] >= selectedProduct.productQuantity) {
      alert(
        `Only ${selectedProduct.productQuantity} ${selectedProduct.productName} available in stock!`
      );
    }
    else {

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
        if (product.productQuantity > 0) {
          this.cartService.addToCart(userId.toString(), product, this.selectedProduct[Number(productId)]);
        }
      }
    });
    this.dialogRef.close();
  }
}
