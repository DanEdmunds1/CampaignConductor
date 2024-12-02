import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


import { WeaponsSpellcastingComponent } from '../weapons-spellcasting/weapons-spellcasting.component';
import { SavingSkillsComponent } from '../saving-skills/saving-skills.component';

import { DmService } from '../dm.service';
import { CharacterService } from '../character.service';
import { PostService } from '../post.service';


@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [CommonModule, WeaponsSpellcastingComponent, SavingSkillsComponent, ReactiveFormsModule],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss'
})


export class CharacterSheetComponent {
  // Inject services
  characterService: CharacterService = inject(CharacterService)
  postService: PostService = inject(PostService)

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
    this.loadAtks()

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

  // // Listen for clicks anywhere on the document
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   // Check if the click is outside the weapon list
  //   const clickedInside = event.target instanceof Element && event.target.closest('.creature');

  //   if (!clickedInside) {
  //     // If the click is outside, deselect the current weapon
  //     this.selectedCreature = null;
  //   }
  // }

  // ngOnDestroy() {
  //   // Clean up the listener when the component is destroyed to avoid memory leaks
  //   // Since we're using @HostListener, Angular handles the cleanup for us.
  // }


  // Create hitdice form object

  hitDiceForm = new FormGroup({
    numOfDice: new FormControl(0)
  })


  response: any;
  error: string | undefined;

  updateHP(hp: number) {
    this.dmService.updateHp(this.character._id, hp).subscribe({
      next: (response) => {
        this.response = response;
        console.log('Heal successful', response)
        this.loadCharacter()
      },
      error: (err) => {
        this.error = `Error: ${err.message}`;
        console.error('Error healing', err)
      }
    })
  }

  updateHitdice(hitdice: number) {
    this.dmService.updateHitdice(this.character._id, hitdice).subscribe({
      next: (response) => {
        this.response = response;
        console.log('Removal of hitdice successful', response)
        this.loadCharacter()
      },
      error: (err) => {
        this.error = `Error: ${err.message}`;
        console.error('Error remove hitdice', err)
      }
    })
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault(); // Prevent any keyboard input in the hit dice input
  }

  useHitDice() {

    const d6 = ['Sorcerer', 'Wizard'];
    const d8 = ['Bard', 'Cleric', 'Druid', 'Monk', 'Rogue', 'Warlock'];
    const d10 = ['Fighter', 'Paladin', 'Ranger'];
    const d12 = ['Barbarian'];

    const numOfDice = {
      num: this.hitDiceForm.value.numOfDice,
    }

    let hp = this.character.hp
    let newHp

    let hitdice = this.character.hitdice
    let newHitdice

    if (d6.includes(this.character.class)) {
      newHp = hp += this.characterService.rollDice(`${numOfDice.num}d6`)
    } else if (d8.includes(this.character.class)) {
      newHp = hp += this.characterService.rollDice(`${numOfDice.num}d8`)
      console.log(numOfDice)
    } else if (d10.includes(this.character.class)) {
      newHp = hp += this.characterService.rollDice(`${numOfDice.num}d10`)
    } else if (d12.includes(this.character.class)) {
      newHp = hp += this.characterService.rollDice(`${numOfDice.num}d12`)
    } else {
      console.log('no class found')
    }

    newHitdice = hitdice -= numOfDice.num!


    if (newHp < this.character.maxHp) {
      this.updateHP(newHp)
      this.updateHitdice(newHitdice)
    } else if (newHp === this.character.maxHp) {
      this.updateHP(this.character.maxHp)
      console.log('fully healed')
    } else if (newHp > this.character.maxHp) {
      this.updateHP(this.character.maxHp)
      console.log('fully healed')
    }

    this.hitDiceForm.reset()

  }

  longRest() {
    this.updateHitdice(this.character.level)
    this.updateHP(this.character.maxHp)
  }

  // Create attack form object
  atkForm = new FormGroup({
    dmgDice: new FormControl('')
  })



  weapons: any[] = []
  spells: any[] = []
  attacks: any[] = []

  loadAtks() {
    this.characterService.getWeaponsForChar().subscribe(
      (data: any) => {
        this.weapons = data
        console.log(this.weapons)
      }
    )

    this.characterService.getSpells().subscribe(
      (data: any) => {

        const id = localStorage.getItem('userId');

        const charSpells = data.result.filter((spell: any) => {

          for (let i = 0; i < spell.owners.length; i++) {
            if (spell.owners[i].owner === id) {
              return true
            }
          }
          return false

        });
        this.spells = charSpells
        console.log(this.spells)
      }
    )



    setTimeout(() => {
      this.attacks = this.weapons.concat(this.spells)
      console.log(this.attacks)
    }, 1000);
  }



  attack() {

    const dmgDice = this.atkForm.value.dmgDice!
    const target = this.selectedCreature

    console.log(`dealing ${dmgDice} against ${target.name}`)

    

    const newHp = target.hp -= this.characterService.rollDice(dmgDice)


    this.dmService.updateHp(target._id, newHp).subscribe({
      next: (response) => {
        this.response = response;
        console.log('Attack successful', response)
        this.loadCreatures()

        if (newHp <= 0) {
          this.postService.delete(target._id).subscribe({
            next: (response) => {
              this.response = response;
              console.log('Creature deleted successfully', response)
              window.alert('Creature Slain')
              this.loadCreatures()
            },
            error: (err) => {
              this.error = `Error: ${err.message}`;
              console.error('Error deleting creature', err)
            }
          })
        }

      },
      error: (err) => {
        this.error = `Error: ${err.message}`;
        console.error('Error attacking', err)
      }
    })


  }


}
