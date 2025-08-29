import { Component ,OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Users } from '../../core/models/users';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
public registerForm!:FormGroup
public name:string='';
public email:string='';
public password:string='';
public phoneNumber:string='';
public address:string='';
constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){}

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
   const user:Users=this.registerForm.value;
   if(this.authService.register(user)){
    alert('User registered succesfully')
    this.router.navigate(['/login'])
   }else{
    alert('Email already exists')
   }
  }
}
}
