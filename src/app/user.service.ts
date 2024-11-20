import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "user"]'

  http = inject(HttpClient)


  submitLogin(username: string, password: string) {
    console.log(`logging in ${username} with password ${password}`)

    return this.http.get(this.userUrl)
  }

  getUserInfo() {
    console.log(localStorage.getItem('userType'))
  }
  

  constructor() { }



}
