import { Component ,OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
public loginForm!:FormGroup
constructor(private fb:FormBuilder){}

ngOnInit() {
  this.loginForm=this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })
}

public login(){
   if(this.loginForm.valid){
    const storedFormData=localStorage.getItem('registerForm');
    if(storedFormData){
     try {
      const formData=JSON.parse(storedFormData)
      if(this.loginForm.get('email')?.value===formData.email && this.loginForm.get('password')?.value===formData.password ){
        console.log("Login successful")
      }
     } catch (error) {
      
     }
    }
   }
}

}
