import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserTypeService } from '../user-type.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isPlayer: string = ''

  constructor(private userTypeService: UserTypeService) {}
  

  ngDoCheck(): void {
    this.isPlayer = this.userTypeService.getUserType();
  }

}
