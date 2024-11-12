import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isPlayer: string = ''

  ngDoCheck(): void {

    if (!localStorage.getItem('userType')) {
      this.isPlayer = 'no-user'
    } else if (localStorage.getItem('userType') === 'true') {
      this.isPlayer = 'true'
    } else if (localStorage.getItem('userType') === 'false') {
      this.isPlayer = 'false'
    } else {
      return
    }


  }

}
