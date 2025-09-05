import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public email: string = '';
  public password: string = ''
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('currentUser')){
      alert('You are logged in already')
      this.router.navigate(['/productDashBoard'])
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  public login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value
      const user = this.authService.login(email, password);
      if (user) {
        alert('Login succesful');
        this.router.navigate(['/productDashBoard'])
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        alert('Invalid credentials')
      }
    }
  }

}
