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
  character: any
  // Create arrays to store the extracted data
  strMod: string | undefined = '';
  dexMod: string | undefined = '';
  conMod: string | undefined = '';
  intMod: string | undefined = '';
  wisMod: string | undefined = '';
  chaMod: string | undefined = '';

  // On page load store the data in relevant arrays
  ngOnInit(): void {
    this.characterService.getCharacterWithMods().subscribe({
      next: (data) => {
        this.character = data.character;
        this.strMod = data.mods.strMod;
        this.dexMod = data.mods.dexMod;
        this.conMod = data.mods.conMod;
        this.intMod = data.mods.intMod;
        this.wisMod = data.mods.wisMod;
        this.chaMod = data.mods.chaMod;

        console.log(this.chaMod);
      },
      error: (err) => {
        console.error('Error fetching character:', err);
      },
    });
  }

}
