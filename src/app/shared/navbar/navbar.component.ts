import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router,public cartService:CartService) {}
  public isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true
    }
    else {
      return false;
    }
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
