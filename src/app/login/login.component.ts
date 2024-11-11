import { Component, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { UserService } from '../user.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';


export interface User {
  username: string;
  password: string;
  _id: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  // Allow use of router when login is successful
  constructor(private router: Router) {

  }

  // Inject user service to use its http requests
  userService = inject(UserService)

  // Create a user array to store the users we return from our http request
  user: any[] = []

  // Create the form object
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })


  // Handle the Login click
  submitLogin() {
    this.userService.submitLogin(
    this.loginForm.value.username ?? ``,
    this.loginForm.value.password ?? ``
    )
  }


  // On page load get all users and store them in the 'user' array
  ngOnInit(): void {
    this.userService.submitLogin('', '').subscribe(
      (data: any) => {
        this.user = data.result
        console.log(data.result)
      }
    )
  
  }



  checkCreds() {

    //* Harry Note: Current login is not very secure, we are retrieving all user objects and searching through them for a match
    //* I want to use tokens but I don't know how yet

    this.userService.submitLogin('', '').subscribe(
      (data: any) => {
        // Take data from CMS
        this.user = data.result
        console.log(data.result)

        // Look through the CMS user array, find the item that has an email that matches the form data + password

        const username = data.result.find((user: User) => user.username === this.loginForm.value.username);

        const password = data.result.find((user: User) => user.password === this.loginForm.value.password)


        // Conditional logic
        if (username && password) {
            console.log("Login Successful", username._id);

            // Set user id in local storage to be used to render login/sign up or log out
            localStorage.setItem('userId', username._id)
            this.router.navigateByUrl('/charactersheet')
        } else if (username) {
            console.log("User exists but incorrect password");
        } else if (password) {
          console.log("Password exists but not for this user")
        } else {
          console.log("No username or password stored here")
        }
      }
    )
  }

}
