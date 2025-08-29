import { Component,OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../core/services/products/products.service';
import { GetProduct } from '../../../core/models/get-product';
import { UpdateProduct } from '../../../core/models/update-product';
@Component({
  selector: 'app-add-edit-product-dialog',
  imports: [MatDialogModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './add-edit-product-dialog.component.html',
  styleUrl: './add-edit-product-dialog.component.scss'
})
export class AddEditProductDialogComponent implements OnInit {
public productForm!:FormGroup;
public isEditMode=false;
public productName:string='';
public productCategory:string='';
public productImgUrl:string='';
public productCost:string='';

constructor(private fb: FormBuilder, private productService:ProductsService, private dialogRef: MatDialogRef<AddEditProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:UpdateProduct) { }

ngOnInit() {
  if(this.data){
    this.isEditMode=true
  }
  this.productForm=this.fb.group({
    productName:[this.data?this.data.productName:'',Validators.required],
    productCategory:[this.data?this.data.productCategory:'',Validators.required],
    productImgUrl:[this.data?this.data.productImgUrl:'',Validators.required],
    productCost:[this.data?this.data.productCost:'',Validators.required]
  })
}

public onSubmit(){
  if(this.productForm.valid){
    if(this.isEditMode){
      this.dialogRef.close({
        productId:this.data.productId,
        ...this.productForm.value
      })
    }
    else{
      this.dialogRef.close(this.productForm.value)
    }
  }
}

public cancel(){
  this.dialogRef.close()
}

}
