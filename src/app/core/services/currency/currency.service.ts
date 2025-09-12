import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private sharedCurrencySubject=new BehaviorSubject<string>('India');
  sharedCurrency$:Observable<string>=this.sharedCurrencySubject.asObservable();
  
  constructor() { }

  public updateCurrency(newCurrency:string)
  {
    this.sharedCurrencySubject.next(newCurrency)
  }
}
