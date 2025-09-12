import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private sharedCurrencySubject=new BehaviorSubject<string>('Rupees');
  sharedCurrency$:Observable<string>=this.sharedCurrencySubject.asObservable();
  
  constructor() { }

  updateCurrency(newCurrency:string)
  {
    this.sharedCurrencySubject.next(newCurrency)
  }
}
