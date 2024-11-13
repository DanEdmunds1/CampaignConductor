import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserTypeService } from '../user-type.service';





@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isPlayer: string = ''

  constructor(private userTypeService: UserTypeService) {}

  ngDoCheck(): void {
    this.isPlayer = this.userTypeService.getUserType();
  }

}
