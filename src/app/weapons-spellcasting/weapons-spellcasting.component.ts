import { Component, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('dropdown') dropdown!: ElementRef;

  // Inject services to use the data from api calls
  characterService: CharacterService = inject(CharacterService)
  postService = inject(PostService)

  // Create arrays to store the data from api calls
  weapons: any[] = []
  allSpells: any[] = []
  charSpells: any[] = []
  learnableSpells: any[] = []
  character: any

  // initialise variables
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
        // Store character in the 'character' object
        this.character = data
        this.profBonus = Math.floor((this.character.character.level - 1) / 4) + 2
      }
    )
  }

  loadSpells() {
    this.characterService.getSpells().subscribe(
      (data: any) => {
        // Stores spells in the 'spells' array

        this.allSpells = data.result
        console.log(this.allSpells)

        const id = localStorage.getItem('userId'); // Get the user ID from localStorage

        // Filter the spells array and return the spells the character has
        const characterSpecificSpells = this.allSpells.filter(spell => {

          for (let i = 0; i < spell.owners.length; i++) {
            if (spell.owners[i].owner === id) {
              return true
            }
          }
          return false

        });
        this.charSpells = characterSpecificSpells

        // store spells that the character does not posses, to be used for the all spells dropdown
        const spellsUserCanLearn = this.allSpells.filter(spell => !this.charSpells.includes(spell))

        this.learnableSpells = spellsUserCanLearn

        // wait for spells to load in before calling the spell levels function
        setTimeout(() => {
          this.getSpellLevels()
          console.log(this.spellLevels)
        }, 500)

      }

    )
  }


  // On page load
  ngOnInit(): void {
    this.loadWeapons()
    this.loadCharacter()
    this.loadSpells()
  }


  // Toggle for showing which weapon the user last clicked on
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
  }




  // Initialise variables to store api responses
  postResponse: any;
  errorMessage: string | undefined;

  // Create the weapon form object
  createWeaponForm = new FormGroup({
    name: new FormControl(''),
    atkBonus: new FormControl(0),
    dmgDice: new FormControl(''),
    dmgType: new FormControl(''),
    owner: new FormControl('')
  })

  // toggle error message telling user to complete all form items to create a weapon
  displayCreateWeaponError: Boolean = false


  // Function to add a weapon to the character sheet
  createWeapon() {
    // format data to be sent via api call
    const content = {
      name: this.createWeaponForm.value.name,
      atkBonus: this.createWeaponForm.value.atkBonus,
      dmgDice: this.createWeaponForm.value.dmgDice,
      dmgType: this.createWeaponForm.value.dmgType,
      owner: localStorage.getItem('userId'),
      _type: 'weapon'
    }

    // Check if all fields have non-empty values
    const allFieldsFilled = Object.values(content).every(value => value !== null && value !== undefined && value !== '');


    if (allFieldsFilled) {
      // call the post function
      this.postService.post(content).subscribe({
        next: (response) => {
          this.postResponse = response;
          console.log('Weapon created successfully', response)
          // reset weapon form
          this.createWeaponForm.reset()
          // close the weapon options
          this.toggleShowWeaponOptions()
          // re-render weapons, now showing the newly added weapon
          this.loadWeapons()
          // remove error message
          this.displayCreateWeaponError = false
        },
        error: (err) => {
          this.errorMessage = `Error: ${err.message}`;
          console.error('Error creating weapon', err)
        }
      })
    } else {
      console.log('missing weapon fields')
      this.displayCreateWeaponError = true
    }

  }

  // Function to remove a weapon from the character sheet
  deleteWeapon(id: string) {
    // call the post function
    this.postService.delete(id).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('Creature deleted successfully', response)
        // re-render weapons, now without the deleted weapon
        this.loadWeapons()
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error deleting creature', err)
      }
    })
  }

  // Toggle for showing weapon options
  showWeaponOptions: Boolean = false
  toggleShowWeaponOptions() {
    this.showWeaponOptions = !this.showWeaponOptions
  }
  // Toggle for showing spell options
  showSpellOptions: Boolean = false
  toggleShowSpellOptions() {
    this.showSpellOptions = !this.showSpellOptions
  }

  // Function to calculate spell-related information to be displayed on character sheet
  calcSpellInfo() {
    // get character stats
    const int = this.character.character.intelligence
    const wis = this.character.character.wisdom
    const cha = this.character.character.charisma
    // find the highest stat, which will be the stat used for spell casting
    const highestValue = Math.max(int, wis, cha)

    // store a string of the highest stat in the 'ability' variable
    let ability
    if (highestValue === int) {
      ability = 'intelligence';
    } else if (highestValue === wis) {
      ability = 'wisdom';
    } else {
      ability = 'charisma';
    }
    // format the string to the way I want it displayed
    //* note that I do not format in the ability-setting if statement, as I use the original strings to calculate the stat mods
    const parsedAbility = ability.slice(0, 3).toUpperCase()

    // calculate the stat mods, i.e. +2, -1, 0, etc
    const score = this.character.character[ability]
    const mod = Math.floor((score - 10) / 2)

    // calculate spell save DC
    const dc = 8 + this.profBonus + mod

    // calculate spell attack bonus
    const bonus = this.profBonus + mod

    // store relevant info in return statement object
    return {
      ability: parsedAbility,
      dc: dc,
      bonus: bonus,
    }
  }

  // initialise a variable to store the spell levels of the spells a character has
  spellLevels: number[] = []

  // Function to extract the spell levels of all spells a character has, and insert a unique set of them into the spellLevels array
  getSpellLevels() {
    // initialise a new set
    const levels = new Set<number>()

    // for each spell, if its level exists, push it into the levels set
    this.charSpells.forEach(spell => {
      if (spell.level !== undefined) {
        levels.add(spell.level)
      }
    })
    console.log(this.spellLevels)
    // ensure spellLevels only contains one of each spell level
    this.spellLevels = [...levels].sort((a, b) => a - b)
  }


  //* Function to remove a spell by removing the character's id from the 'owners' array of a spell
  removeSpell(spell: any) {
    console.log(spell._id)
    // store the spell's 'owners' array in a variable
    const owners = spell.owners

    // intialise variable to store the index of the relevant user/character id in the 'owners' array
    let ownerIndex: number = 0

    // look through every object in the owners array
    // if the key 'owner' matches the userId, return the index of that object to be used to select the owner to remove
    // the unset method for sanity does not have the ability to search dynamically based on content, so this is my solution
    for (let i = 0; i < owners.length; i++) {
      if (owners[i]['owner'] === localStorage.getItem('userId')) {
        ownerIndex = i
      }
    }

    // variable to store the spell's id
    const id = spell._id
    // format the index of the relevant owner to be passed into the removeOwner function
    const parsedIndex = `owners[${ownerIndex}]`

    // call the removeOwner function
    this.postService.removeOwner(id, parsedIndex).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('Spell owner removed', response)
        // re-render spells, now without the deleted spell
        this.loadSpells()
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error removing spell owner', err)
      }
    })

  }


  //* Function to learn a spell by adding the character's id to the 'owners' array of a spell
  learnSpell(spell: any) {

    // target the spell clicked on
    const selectedSpellId = (spell.target as HTMLSelectElement).value;
    // search through all spells the character does not have, and find the one whose id matches the spell clicked on
    const selectedSpell = this.learnableSpells.find(spell => spell._id === selectedSpellId);

    // generate a random string to be used as a unique key when creating a new owner object in the spell's 'owners' array
    const keyString = this.postService.generateRandomString(62)

    // format the data to be sent to sanity via HTTP request
    const ownerObj = {
      owner: localStorage.getItem('userId'),
      _key: keyString
    }

    // reset the dropdown when a spell is clicked on
    this.dropdown.nativeElement.value = ''

    this.postService.learnSpell(selectedSpell._id, ownerObj).subscribe({
      next: (response) => {
        this.postResponse = response;
        console.log('Spell learned', response)
        // re-render spells, now with the new spell added to the character sheet
        this.loadSpells()
      },
      error: (err) => {
        this.errorMessage = `Error: ${err.message}`;
        console.error('Error learning spell', err)
      }
    })
  }

  selectedSpell: string | null = null

  showSpellEffect(spell: string) {
    this.selectedSpell = spell
  }

  // Reset the selected spell when mouse leaves
  hideSpellEffect() {
    this.selectedSpell = null;
  }

}