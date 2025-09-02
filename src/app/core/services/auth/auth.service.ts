import { Injectable } from '@angular/core';
import { Users } from '../../models/users/users';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  private key="users";

  public getUsers():Users[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }
  
  public saveUsers(users:Users[]){
    localStorage.setItem(this.key,JSON.stringify(users));
  }
  
  public register(user:Users):boolean{
    const users=this.getUsers();
    if(users.find(u=>u.email===user.email)){
      return false
    }
    user.userId=users.length>0?users[users.length-1].userId+1:1;
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  public login(email:string,password:string){
    const users=this.getUsers();
    const userFound=users.find(u=>u.email===email && u.password===password);
    if(userFound){
      return userFound
    }else{
      return null;
    }
  }

}
