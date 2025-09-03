import { Component ,Inject,OnInit} from '@angular/core';
import { Reviews } from '../../../core/models/reviews/reviews';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxStarRatingModule } from 'ngx-star-rating';
@Component({
  selector: 'app-add-reviews',
  imports: [NgxStarRatingModule,MatDialogModule,MatFormFieldModule,MatInputModule,FormsModule,ReactiveFormsModule,MatButtonModule],
  templateUrl: './add-reviews.component.html',
  styleUrl: './add-reviews.component.scss'
})
export class AddReviewsComponent implements OnInit{
public reviewForm!:FormGroup;
public productReview:string='';
public rating:string='';
constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddReviewsComponent>, @Inject(MAT_DIALOG_DATA) public data: Reviews){}

ngOnInit() {
  
  this.reviewForm=this.fb.group({
  productReview:['',[Validators.required,this.noBlankspaceValidator]],
  rating:['',Validators.required]
  })
}

public noBlankspaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

public onSubmit(){
  if(this.reviewForm.valid){
    this.dialogRef.close(this.reviewForm.value);
  }
}

public cancel(){
  this.dialogRef.close();
}
}
