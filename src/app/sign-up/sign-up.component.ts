import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  // Allow use of router when user creation is complete
  constructor(private router: Router) {

  }

  postService = inject(PostService)

  createdUser: any = ''

  createUserForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    isPlayer: new FormControl(''),
  })

  postResponse: any;
  errorMessage: string | undefined;

  createUser() {
    this.createdUser = this.createUserForm.value


    // Convert values from form into boolean
    let isPlayerValue
    if(this.createUserForm.value.isPlayer === "true") {
      isPlayerValue = true
    } else {
      isPlayerValue = false
    }
   

    const content = {
      username: this.createUserForm.value.username,
      password: this.createUserForm.value.password,
      isPlayer: isPlayerValue,
      _type: 'user'
    }

    console.log(content)



    this.postService.post(content).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('User created successfully', response)

        //! must navigate to create character OR DM Page
        this.router.navigateByUrl('/home')
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error creating user', err)
      }
    })
  }

}
