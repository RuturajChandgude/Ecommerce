import { Component,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { CountryCurrency } from '../../core/models/countryCurrency/country-currency';
import { CurrencyService } from '../../core/services/currency/currency.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,MatSelectModule,MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent  {
  public selectedCurrency:string=''
  public countryCurrencyMap:CountryCurrency[]=[
    {country:'India',currencyPrice:88.44},
    {country:'USA',currencyPrice:1},
    {country:'France',currencyPrice:0.86},
    {country:'England',currencyPrice:0.74}
  ]

  constructor(private router: Router,public cartService:CartService,private currencyService:CurrencyService) {}

  public isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true
    }
    else {
      return false;
    }
  }

  public convertCurrency()
  {
    this.currencyService.updateCurrency(this.selectedCurrency)
  }

  public logout() {
    const confirmLogout = confirm('Are you sure you want to logout?')
    if (confirmLogout) {
      localStorage.removeItem('currentUser');
      alert('Logout Successful!')
      window.location.reload();
      this.router.navigate(['/login'])
    }
  }
}
