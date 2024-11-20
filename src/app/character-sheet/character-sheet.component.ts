import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../character.service';
import { WeaponsSpellcastingComponent } from '../weapons-spellcasting/weapons-spellcasting.component';
import { SavingSkillsComponent } from '../saving-skills/saving-skills.component';

import { DmService } from '../dm.service';



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


  strMod: string | undefined = '';
  dexMod: string | undefined = '';
  conMod: string | undefined = '';
  intMod: string | undefined = '';
  wisMod: string | undefined = '';
  chaMod: string | undefined = '';


  constructor() { }

  loadCharacter() {
    this.characterService.getCharacterWithMods().subscribe({
      next: (data) => {
        this.character = data.character;
        this.strMod = data.mods.strMod;
        this.dexMod = data.mods.dexMod;
        this.conMod = data.mods.conMod;
        this.intMod = data.mods.intMod;
        this.wisMod = data.mods.wisMod;
        this.chaMod = data.mods.chaMod;

      },
      error: (err) => {
        console.error('Error fetching character:', err);
      },
    });
  }


  ngOnInit(): void {
    this.loadCharacter()
    this.loadCreatures()

    setInterval(() => {
      this.loadCharacter()
    }, 5000)
  }

  dmService: DmService = inject(DmService)
  creatures: any = []

  loadCreatures() {
    // Open up creatures returned
    this.dmService.getCreatures().subscribe(
      (data: any) => {

        // get campaign id from local storage and store in variable
        const campaignId = localStorage.getItem('campaignId')

        // filter through all creatures and only return those with the correct campaign id
        const relevantCreatures = data.result.filter((creature: any) => {
          if (creature.campaignId === campaignId) {
            return creature
          }
        })
        // Store the creatures from data.result in the creatures array
        this.creatures = relevantCreatures
        console.log(relevantCreatures)
      },
    )
  }

  handleSelect(creature: any, name: string) {
    this.toggleSelectedCreature(creature)
    this.selectCreature(name)
  }

  selectCreature(name: string) {
    const selectedCreature = document.getElementById(name)
    console.log(selectedCreature)

  
  }

  selectedCreature: any = null

  toggleSelectedCreature(creature: any) {
    console.log(creature)
    if (this.selectedCreature === creature) {
      this.selectedCreature = null
    } else {
      this.selectedCreature = creature
    }
  }

  // Listen for clicks anywhere on the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click is outside the weapon list
    const clickedInside = event.target instanceof Element && event.target.closest('.creature');

    if (!clickedInside) {
      // If the click is outside, deselect the current weapon
      this.selectedCreature = null;
    }
  }

  ngOnDestroy() {
    // Clean up the listener when the component is destroyed to avoid memory leaks
    // Since we're using @HostListener, Angular handles the cleanup for us.
  }



 


}
