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
@Component({
  selector: 'app-add-bulk-order',
  imports: [MatDialogModule,MatCheckboxModule,FormsModule,MatIconModule],
  templateUrl: './add-bulk-order.component.html',
  styleUrl: './add-bulk-order.component.scss'
})
export class AddBulkOrderComponent implements OnInit{
  public products:GetProduct[]=[]
  public qty=1;
  public  selectedProduct:{[key:number]:number}={}
   
  isChecked: boolean = false;
  constructor(private productService:ProductsService,private cartService:CartService,public dialogRef:MatDialogRef<AddBulkOrderComponent>,@Inject(MAT_DIALOG_DATA) public data:GetProduct[]){}
  ngOnInit() {
    console.log("Recieved data",this.data)
    this.products=this.productService.getProducts();
    console.log('all products',this.products)
    //  this.selected=new Array(this.data.length).fill(false) 
  }
  
  public onCheckBoxChange(productId:number,event:MatCheckboxChange)
  {
    if(event.checked)
      {
        // this.selectedProduct.push(product)
        this.selectedProduct[productId]=1
        // console.log("selected ",this.selectedProduct)
      }
      else{
        // this.selectedProduct=this.selectedProduct.filter(i=>i.productId!==product.productId)
        // console.log("selected ",this.selectedProduct)
        delete this.selectedProduct[productId]
      }
    }
    
    public increase(productId:number) {
    this.selectedProduct[productId]++
    
    console.log(this.selectedProduct)
  }

  public decrease(productId:number) {
   this.selectedProduct[productId]--;
  }
 
   get selectedCount():number{
    return Object.keys(this.selectedProduct).length
   }

  public addSelectedToCart()
  {
    const currentUser=JSON.parse(localStorage.getItem('currentUser') || '[]')
    const userId=currentUser.userId
    console.log("selectedproducts",this.selectedProduct)
    console.log("products",this.products)
    
    Object.keys(this.selectedProduct).forEach(productId=>{
      const product = this.data.find((p)=>
        p.productId==Number(productId)
      )
        if(product)
        {
          this.cartService.addToCart(userId.toString(),product,this.selectedProduct[Number(productId)])
        }
    })
    this.dialogRef.close()
  }
  }
  