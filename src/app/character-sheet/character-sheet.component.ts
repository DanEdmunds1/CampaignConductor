import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../character.service';
import { WeaponsSpellcastingComponent } from '../weapons-spellcasting/weapons-spellcasting.component';
import { SavingSkillsComponent } from '../saving-skills/saving-skills.component';


@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [CommonModule, WeaponsSpellcastingComponent, SavingSkillsComponent],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss'
})


export class CharacterSheetComponent {
  // Must inject character service in order to access its http requests
  characterService: CharacterService = inject(CharacterService)

  // Create array in which to store the characters returned by the http call
  character: any

  constructor() {

  }

  strMod: string | undefined = '';
  dexMod: string | undefined = '';
  conMod: string | undefined = '';
  intMod: string | undefined = '';
  wisMod: string | undefined = '';
  chaMod: string | undefined = '';

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

        console.log(this.character);
      },
      error: (err) => {
        console.error('Error fetching character:', err);
      },
    });
  }


}
