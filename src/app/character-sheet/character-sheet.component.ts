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
  character: any[] = []

  // Create an array in which to store the stat modifiers we extract from the character
  convertToMod: any[] = []

  constructor() {
    
  }

  ngOnInit(): void {
    // Open up characters returned
    this.characterService.getCharacters().subscribe(
      (data: any) => {
        // Store the characters from data.result in the character array
        this.character = data.result
        console.log(data.result)
        
        // Function extracting stat mods from character
        this.convertToMod = this.character.map(char => {
          const calculateMod = (score: number) => {
            const modValue = (score - 10) / 2;
            if (modValue > 0) {
             this.convertToMod.push(`+${modValue.toString()}`)
             return `+${modValue.toString()}`
            } else {
              this.convertToMod.push(modValue.toString())
              return modValue.toString()
            }
          };
        
          return [
            calculateMod(char.strength),
            calculateMod(char.dexterity),
            calculateMod(char.constitution),
            calculateMod(char.intelligence),
            calculateMod(char.wisdom),
            calculateMod(char.charisma)
          ];
        });

        console.log(this.convertToMod)

        this.character.forEach(char => {
          console.log(char)
        })
      },
    )

   


  }


}
