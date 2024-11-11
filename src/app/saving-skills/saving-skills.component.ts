import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-saving-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saving-skills.component.html',
  styleUrl: './saving-skills.component.scss'
})
export class SavingSkillsComponent {
  // Inject character service to use its http reqs
  characterService: CharacterService = inject(CharacterService)

// Create arrays to store the extracted data
  skills: any[] = []
  savingThrows: any[] = []

  // On page load store the data in relevant arrays
  ngOnInit(): void {
  this.characterService.getSkills().subscribe(
    (data: any) => {
      this.skills = data.result
      console.log(data.result)
    }
  )

  this.characterService.getSavingThrows().subscribe(
    (data: any) => {
      this.savingThrows = data.result
      console.log(data.result)
    }
  )
}

}
