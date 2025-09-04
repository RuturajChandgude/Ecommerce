import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../core/services/products/products.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UpdateProduct } from '../../../core/models/products/update-product';
import {MatSelectModule} from '@angular/material/select';
import { ProductCategory } from '../../../core/models/category/product-category';
@Component({
  selector: 'app-add-edit-product-dialog',
  imports: [MatSelectModule,MatDialogModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-product-dialog.component.html',
  styleUrl: './add-edit-product-dialog.component.scss'
})
export class AddEditProductDialogComponent implements OnInit {
  public productForm!: FormGroup;
  public isEditMode = false;
  public productName: string = '';
  public productCategory: string = '';
  public productImgUrl: [] = [];
  public productCost: number = 0;
  public productQuantity: number = 0;
  public weight: number = 0;
  public color: string = '';
  public width: number = 0;
  public height: number = 0;
  public previewUrl: string[] = [];
  public categoryArray:ProductCategory[]=[]

  constructor(private fb: FormBuilder, private productService: ProductsService, private dialogRef: MatDialogRef<AddEditProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UpdateProduct) { }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.previewUrl = this.data.productImgUrl || [];
    }
    this.categoryArray=JSON.parse(localStorage.getItem('productCategories') || '[]')
 
    this.productForm = this.fb.group({
      productName: [this.data ? this.data.productName : '', [Validators.required, this.noBlankspaceValidator]],
      productCategory: [this.data ? this.data.productCategory : '', Validators.required],
      productImgUrl: [this.data ? this.data.productImgUrl : [], [Validators.required]],
      productCost: [this.data ? this.data.productCost : 0, Validators.required],
      productQuantity: [this.data ? this.data.productQuantity : 0, Validators.required],
      weight: [this.data ? this.data.weight : '', Validators.required],
      color: [this.data ? this.data.color : '', [Validators.required, this.noBlankspaceValidator]],
      width: [this.data ? this.data.width : '', Validators.required],
      height: [this.data ? this.data.height : '', Validators.required]
    })
  }

  public noBlankspaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  public onFileSelected(event: Event) {
    const input = (event.target as HTMLInputElement);
    if (!input.files || input.files?.length === 0) {
      return;
    }
    this.previewUrl=[];
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i]
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const result=e.target.result as string
          this.previewUrl.push(result);
          console.log(this.previewUrl);
          this.productForm.patchValue({productImgUrl:[...this.previewUrl]})
        }
        reader.readAsDataURL(file);
      }
    }
    //input.value=''
  }

  public onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.dialogRef.close({
          productId: this.data.productId,
          ...this.productForm.value
        })
      }
      else {
        this.dialogRef.close(this.productForm.value)
      }
    }
  }

  public cancel() {
    this.dialogRef.close()
  }

}
