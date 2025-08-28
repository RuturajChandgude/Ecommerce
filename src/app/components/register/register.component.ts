import { Component ,OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
public registerForm!:FormGroup
constructor(private fb:FormBuilder){}

ngOnInit() {
  this.registerForm=this.fb.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]],
    phoneNumber:['',[Validators.required,Validators.pattern("[0-9]{10}")]],
    address:['',Validators.required]
  })
}

public register(){
  if(this.registerForm.valid){
    localStorage.setItem('registerForm',JSON.stringify(this.registerForm.value))
    console.log(this.registerForm.value)
  }
}
}
