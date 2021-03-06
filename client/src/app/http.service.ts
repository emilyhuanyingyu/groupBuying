import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ClassField } from '@angular/compiler/src/output/output_ast';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';



@Injectable()
export class HttpService {
  currentUser = null;

  loginstatus: BehaviorSubject<any[]> = new BehaviorSubject([]);
  checkLogin: BehaviorSubject<any[]> = new BehaviorSubject([]);
  update_group_completed: BehaviorSubject<any[]> = new BehaviorSubject([]);
  
  constructor(private _http: Http) {
    
    if (localStorage.currentUser !== undefined){
      this.currentUser = JSON.parse(localStorage.currentUser);
      // 
      const data = [{
        user: this.currentUser,
        mesg: null
      }];
      this.updateLoginStatus(data);
    } else {
      const data = [{
        user: null,
        mesg: null
      }];
      this.updateLoginStatus(data);
    }
  }

  updateLoginStatus(data) {
    this.loginstatus.next(data);
  }

  regisUser(data) {
    return this._http.post('/register', data)
    .map(res => res.json());
  }

  createPlan(newplan){
    return this._http.post(`/newplan/${this.currentUser._id}`, newplan)
    .map(res => res.json());
      }

  joinPlan(user_id, plan_id){
    return this._http.post(`/joinplan/${user_id}/${plan_id}`, {})
    .map(res => res.json());
  }
      
  getPendingUser(token){
    return this._http.get(`/activate_new/${token}`)
    .map(data => data.json())
  }

  login(userdata){
    return this._http.post('/login', userdata)
    .map((user) => {
      // 
      if(user.json().error === undefined){
        this.currentUser = user.json();
        localStorage.currentUser = JSON.stringify(user.json());
        const data = [{
          user: this.currentUser,
          mesg: null
        }];
        this.updateLoginStatus(data);
      }else{
        
      }
      return user.json();

    })
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getPlans() {
    return this._http.get("/plans")
    .map(data => data.json())
  }

  getTotalUsers() {
    return this._http.get("/totalusers")
    .map(data => data.json())
  }

  updateGroupCompleted(data) {
    this.update_group_completed.next(data);
  }

  getCurrentUser(id) {
    return this._http.get("/theuser/" + id)
    .map(data => data.json())
  }

  
}

