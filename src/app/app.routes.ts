import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
export const routes: Routes = [
    {path:'register',loadComponent:()=>import('./components/register/register.component').then((m)=>m.RegisterComponent)},
    {path:'login',loadComponent:()=>import('./components/login/login.component').then((m)=>m.LoginComponent)},
    {path:'productDashBoard',loadComponent:()=>import('./components/productDashboard/products-data/products-data.component').then((m)=>m.ProductsDataComponent),canActivate:[authGuard]},
    {path:'productDetails',loadComponent:()=>import('./components/product-details/product-details.component').then((m)=>m.ProductDetailsComponent),canActivate:[authGuard]}

];
