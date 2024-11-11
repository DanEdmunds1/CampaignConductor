import { Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-weapons-spellcasting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons-spellcasting.component.html',
  styleUrl: './weapons-spellcasting.component.scss'
})
export class WeaponsSpellcastingComponent {
  // Inject character service to use the data from api calls
  characterService: CharacterService = inject(CharacterService)

  // Create arrays to store the data from api calls
  weapons: any[] = []
  spells: any[] = []
  character: any[] = []

  profBonus: number = 0
  selectedWeapon: any = null

  constructor() {}


  // On page load
  ngOnInit(): void {

    this.characterService.getWeapons().subscribe(
      (data: any) => {
        // Stores weapons in the 'weapons' array
        this.weapons = data.result
        console.log(data.result)
      }
    )

    this.characterService.getSpells().subscribe(
      (data: any) => {
        // Stores spells in the 'spells' array
        this.spells = data.result
        console.log(data.result)
      }
    )

    this.characterService.getCharacters().subscribe(
      (data: any) => {
        // Store character in the 'character' array
        this.character = data.result
        this.profBonus = Math.floor((this.character[0].level - 1) / 4) + 2
      }
    )

  }

  toggleSelectedWeapon(weapon: any) {
    if (this.selectedWeapon === weapon) {
      this.selectedWeapon = null
    } else {
      this.selectedWeapon = weapon
    }
  }

    // Listen for clicks anywhere on the document
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      // Check if the click is outside the weapon list
      const clickedInside = event.target instanceof Element && event.target.closest('.weapon');
      
      if (!clickedInside) {
        // If the click is outside, deselect the current weapon
        this.selectedWeapon = null;
      }
    }
  
    ngOnDestroy() {
      // Clean up the listener when the component is destroyed to avoid memory leaks
      // Since we're using @HostListener, Angular handles the cleanup for us.
    }

}
