import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, ClipboardModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  // Allow use of router when user creation is complete
  constructor(private router: Router, private clipboard: Clipboard) {

  }

  postService = inject(PostService)

  createUserForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    isPlayer: new FormControl(''),
    campaignId: new FormControl('')
  })

  postResponse: any;
  errorMessage: string | undefined;

  userService: UserService = inject(UserService)

  allUsers: any[] = []

  getUserId() {
    this.userService.submitLogin('', '').subscribe(
      (data: any) => {
        this.allUsers = data.result
        console.log(data.result)



        const currentUser = this.allUsers.find((user: any) => user.username === this.createUserForm.value.username);

        localStorage.setItem('userId', currentUser._id)
        localStorage.setItem('userType', currentUser.isPlayer)
        localStorage.setItem('campaignId', currentUser.campaignId)
      }
    )
  }

  generateRandomKey() {
    const string = this.postService.generateRandomString(62)

    this.clipboard.copy(string)
    alert('Copied to clipboard')
  }



  createUser() {


    // Convert values from form into boolean
    let isPlayerValue
    if (this.createUserForm.value.isPlayer === "true") {
      isPlayerValue = true
    } else {
      isPlayerValue = false
    }


    const content = {
      username: this.createUserForm.value.username,
      password: this.createUserForm.value.password,
      isPlayer: isPlayerValue,
      campaignId: this.createUserForm.value.campaignId,
      _type: 'user'
    }

    console.log(content)
   

   // Check if all fields have non-empty values
   const allFieldsFilled = Object.values(content).every(value => value !== null && value !== undefined && value !== '');

   if (allFieldsFilled) {
        this.postService.post(content).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('User created successfully', response)
        this.getUserId()
        this.router.navigateByUrl('/createCharacter')
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error creating user', err)
      }
    })
   } else {
    console.log('missing signup fields')
  }


  }

}
