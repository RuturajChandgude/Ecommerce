import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { OrderhistoryComponent } from './components/orderhistory/orderhistory/orderhistory.component';
export const routes: Routes = [
    {path:'register',loadComponent:()=>import('./components/register/register.component').then((m)=>m.RegisterComponent)},
    {path:'login',loadComponent:()=>import('./components/login/login.component').then((m)=>m.LoginComponent)},
    {path:'productDashBoard',loadComponent:()=>import('./components/productDashboard/products-data/products-data.component').then((m)=>m.ProductsDataComponent),canActivate:[authGuard]},
    {path:'productDetails',loadComponent:()=>import('./components/productDetails/product-details/product-details.component').then((m)=>m.ProductDetailsComponent),canActivate:[authGuard]},
    {path:'cart',loadComponent:()=>import('./components/cart/cart.component').then((m)=>m.CartComponent),canActivate:[authGuard]},
    {path:'orderHistory',loadComponent:()=>import('./components/orderhistory/orderhistory/orderhistory.component').then((m)=>m.OrderhistoryComponent),canActivate:[authGuard]}
];
