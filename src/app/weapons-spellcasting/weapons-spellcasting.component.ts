import { Component, inject, HostListener, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../character.service';
import { PostService } from '../post.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-weapons-spellcasting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weapons-spellcasting.component.html',
  styleUrl: './weapons-spellcasting.component.scss'
})
export class WeaponsSpellcastingComponent {
  // Inject character service to use the data from api calls
  characterService: CharacterService = inject(CharacterService)

  // Create arrays to store the data from api calls
  weapons: any[] = []
  allSpells: any[] = []
  charSpells: any[] = []
  character: any

  profBonus: number = 0
  selectedWeapon: any = null

  constructor() { }

  loadWeapons() {
    this.characterService.getWeaponsForChar().subscribe(
      (data: any) => {
        // Stores weapons in the 'weapons' array
        this.weapons = data
      }
    )
  }

  loadCharacter() {
    this.characterService.getCharacterWithMods().subscribe(
      (data: any) => {
        // Store character in the 'character' array
        this.character = data
        this.profBonus = Math.floor((this.character.character.level - 1) / 4) + 2
      }
    )
  }


  // On page load
  ngOnInit(): void {

    this.loadWeapons()
    this.loadCharacter()

    // this.spellLevels = this.getSpellLevels()
    // console.log(this.spellLevels)


    this.characterService.getSpells().subscribe(
      (data: any) => {
        // Stores spells in the 'spells' array
        this.allSpells = data.result
        console.log(this.allSpells)

        const id = localStorage.getItem('userId'); // Get the user ID from localStorage

        // Filter the spells array
        const help = this.allSpells.filter(spell => {
         
          for (let i = 0; i < spell.owners.length; i++) {
            if (spell.owners[i].owner === id) {
              return true
            }
          }
          return false
    
        });
        
        console.log('help', help); // Log the filtered spells to the console
    
        this.charSpells = help

      }
    )

    setTimeout(() => {
      this.spellLevels = this.getSpellLevels()
      console.log(this.spellLevels)
    }, 300)



    console.log(this.charSpells)



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

  postService = inject(PostService)

  // Initialise variables to store api responses
  postResponse: any;
  errorMessage: string | undefined;

  // Create the form object
  createWeaponForm = new FormGroup({
    name: new FormControl(''),
    atkBonus: new FormControl(0),
    dmgDice: new FormControl(''),
    dmgType: new FormControl(''),
    owner: new FormControl('')
  })

  createWeapon() {
    const content = {
      name: this.createWeaponForm.value.name,
      atkBonus: this.createWeaponForm.value.atkBonus,
      dmgDice: this.createWeaponForm.value.dmgDice,
      dmgType: this.createWeaponForm.value.dmgType,
      owner: localStorage.getItem('userId'),
      _type: 'weapon'
    }

    this.postService.post(content).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('Weapon created successfully', response)
        this.createWeaponForm.reset()
        this.toggleShowWeaponOptions()
        this.loadWeapons()


      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error creating weapon', err)
      }
    })
  }

  deleteWeapon(id: string) {
    this.postService.delete(id).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('Creature deleted successfully', response)
        this.loadWeapons()
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error deleting creature', err)
      }
    })
  }

  showWeaponOptions: Boolean = false
  toggleShowWeaponOptions() {
    this.showWeaponOptions = !this.showWeaponOptions
  }

  showSpellOptions: Boolean = true
  toggleShowSpellOptions() {
    this.showSpellOptions = !this.showSpellOptions
  }

  calcSpellInfo() {
    const int = this.character.character.intelligence
    const wis = this.character.character.wisdom
    const cha = this.character.character.charisma

    const highestValue = Math.max(int, wis, cha)

    let ability
    if (highestValue === int) {
      ability = 'intelligence';
    } else if (highestValue === wis) {
      ability = 'wisdom';
    } else {
      ability = 'charisma';
    }

    const parsedAbility = ability.slice(0, 3).toUpperCase()

    const score = this.character.character[ability]
    const mod = Math.floor((score - 10) / 2)

    const dc = 8 + this.profBonus + mod

    const bonus = this.profBonus + mod

    return {
      ability: parsedAbility,
      dc: dc,
      bonus: bonus,
    }
  }

  spellLevels: number[] = []


  getSpellLevels() {

    const levels = new Set<number>()

    this.charSpells.forEach(spell => {
      if (spell.level !== undefined) {
        levels.add(spell.level)
      }
    })
    return [...levels].sort((a, b) => a - b)
  }

}
