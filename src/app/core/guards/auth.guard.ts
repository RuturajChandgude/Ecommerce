import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    return true
  } else {
    alert('Please login to continue');
    window.location.href = '/login';
    return false;
  }
};
