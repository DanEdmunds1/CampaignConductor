import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserTypeService } from '../user-type.service';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';





@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, ClipboardModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  campaignId: string | null = null

  isPlayer: string = ''

  constructor(private userTypeService: UserTypeService, private clipboard: Clipboard) { }

  ngDoCheck(): void {
    this.isPlayer = this.userTypeService.getUserType();
    this.campaignId = localStorage.getItem('campaignId')
  }

  copyId() {
    if (this.campaignId) {
      this.clipboard.copy(this.campaignId)
      alert('Copied to clipboard')
    }
  }

}
