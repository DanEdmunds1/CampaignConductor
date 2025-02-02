import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  // Allow use of router when login is successful
  constructor(private router: Router) {

  }


  logout() {
    localStorage.removeItem('userType')
    localStorage.removeItem('userId')
    localStorage.removeItem('campaignId')
    this.router.navigateByUrl('/home')
  }

}
