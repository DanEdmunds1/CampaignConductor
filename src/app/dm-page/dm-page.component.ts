import { Component, inject } from '@angular/core';
import { DmService } from '../dm.service';
import { CharacterService } from '../character.service';
import { PostService } from '../post.service';

// allows us to use *ngFor
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import e from 'express';


@Component({
  selector: 'app-dm-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dm-page.component.html',
  styleUrl: './dm-page.component.scss'
})
export class DmPageComponent {

  // Must inject dm service in order to access its http requests
  dmService: DmService = inject(DmService)
  postService: PostService = inject(PostService)
  // Create array in which to store the creatures returned by the http call
  creatures: any[] = []


  // inject character service, return characters with a matching campaign id
  characterService: CharacterService = inject(CharacterService)
  // Create array in which to store the characters returned by the http call
  characters: any[] = []


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

  loadCharacters() {
    // Open up characters returned
    this.characterService.getCharacters().subscribe(
      (data: any) => {

        // get campaign id from local storage and store in variable
        const campaignId = localStorage.getItem('campaignId')

        // filter through all characters and only return those with the correct campaign id
        const relevantCharacters = data.result.filter((char: any) => {
          if (char.campaignId === campaignId) {
            return char
          }
        })
        // Store the creatures from data.result in the creatures array
        this.characters = relevantCharacters

        console.log(relevantCharacters)
        console.log('characters loaded')
      },
    )
  }


  ngOnInit(): void {

    this.loadCreatures()
    this.loadCharacters()

  }

  //* CHARACTERS DISPLAY




  //* ATTACK FORM
  // Initialise a varible for the form data to be stored in
  attack: any = ''

  // Create the form object
  attackForm = new FormGroup({
    name: new FormControl(''),
    atkMod: new FormControl(0),
    dmgDice: new FormControl(''),
    dmgType: new FormControl(''),
    target: new FormControl('')
  })

  isValid: boolean = true; // Initially valid, no 'invalid' class

  atkModelChange() {
    this.checkFields(this.attackForm.value, 'atk')
  }

  creatureModelChange() {
    this.checkFields(this.createCreatureForm.value, 'creature')
  }

  constructor() { }



  checkFields(form: any, prefix: string) {
    const formGiven = form
    const prefixGiven = prefix

    for (const [key, value] of Object.entries(formGiven)) {

      const element = document.getElementById(`${prefixGiven}-${key}`)

      if (value === "" || value === 0 || value === null) {
        element?.classList.add(`${prefixGiven}-invalid`)

      } else {
        element?.classList.remove(`${prefixGiven}-invalid`)
      }
    }
  }


  // Function that collates all data from the form
  getAtkInfo() {
    this.attack = this.attackForm.value
    this.atkModelChange()

    const allFieldsFilled = Object.values(this.attack).every(value => value !== null && value !== undefined && value !== '');

    if (allFieldsFilled) {
      console.log(this.attack)
      this.rollAttack(this.attack)
      // reset form
      this.attackForm.reset({
        atkMod: 0,
        dmgDice: 'Select Dmg Dice',
        dmgType: 'Select Dmg Type',
        target: 'Select Target'
      })
    } else {
      console.log('attack fields missing')
    }

  }

  // generate a random integer between min and max inclusive
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // parse dice roll string and generate damage
  rollDmg(dice: string): number {

    // Regex to match dice format
    const regex = /^(\d+)d(\d+)$/;
    const match = dice.match(regex)

    if (match) {
      // parse string to number via regex expression, 10 specifies radix in which number is represented
      const diceNum = parseInt(match[1], 10)
      const sidesNum = parseInt(match[2], 10)

      let total = 0

      // roll each dice
      for (let i = 0; i < diceNum; i++) {
        total += this.getRandomInt(1, sidesNum)
      }
      console.log('TOTAL')
      console.log(total)

      return total
    } else {
      throw new Error('invalid dice notation')
    }
  }


  atkResponse: any;
  atkErrorMessage: string | undefined;

  rollAttack(atk: any) {
    const hit = Math.floor(Math.random() * 20) + 1

    // store target of the attack in a variable
    const target = this.characters.find((char) => char.name === atk.target)

    if (target) {
      console.log(target)
      console.log(hit)
      if (hit + atk.atkMod >= target.AC) {

        let currentHp = target.hp

        const newHp = currentHp -= this.rollDmg(atk.dmgDice)

        console.log('hit')

        this.dmService.updateHp(target._id, newHp).subscribe({
          next: (response) => {
            this.atkResponse = response;
            console.log('Attack successful', response)
          },
          error: (err) => {
            this.atkErrorMessage = `Error: ${err.message}`;
            console.error('Error attacking', err)
          }
        })



        //TODO: Replace http requests with async function to avoid having to do this
        //* Angular is faster than the http requests, so we nee dot wait for the cms values to be updated before rendering the new hp value
        setTimeout(() => {
          this.loadCharacters()
        }, 2000)


      } else {
        console.log('miss')
      }


    } else {
      console.log('no target')
    }


  }

  //* CREATE CREATURE

  // Initialise a varible for the form data to be stored in
  createdCreature: any = ''

  // Create the form object
  createCreatureForm = new FormGroup({
    name: new FormControl(''),
    ac: new FormControl(0),
    hp: new FormControl(0),

    // Stats
    strength: new FormControl(0),
    dexterity: new FormControl(0),
    constitution: new FormControl(0),
    intelligence: new FormControl(0),
    wisdom: new FormControl(0),
    charisma: new FormControl(0),

    campaignId: new FormControl('')

  })

  postResponse: any;
  createErrorMessage: string | undefined;


  createCreature() {

    this.creatureModelChange()

    const content = {
      name: this.createCreatureForm.value.name,
      ac: this.createCreatureForm.value.ac,
      hp: this.createCreatureForm.value.hp,
      strength: this.createCreatureForm.value.strength,
      dexterity: this.createCreatureForm.value.dexterity,
      constitution: this.createCreatureForm.value.constitution,
      intelligence: this.createCreatureForm.value.intelligence,
      wisdom: this.createCreatureForm.value.wisdom,
      charisma: this.createCreatureForm.value.charisma,
      campaignId: localStorage.getItem('campaignId'),
      _type: 'creature'
    }

    // Check if all fields have non-empty values
    const allFieldsFilled = Object.values(content).every(value => value !== null && value !== undefined && value !== '');

    if (allFieldsFilled) {
      this.postService.post(content).subscribe({
        next: (response) => {
          this.postResponse = response;
          console.log('Character created successfully', response)
        },
        error: (err) => {
          this.createErrorMessage = `Error: ${err.message}`;
          console.error('Error creating character', err)
        }
      })
      // reset form
      this.createCreatureForm.reset({
        ac: 0,
        hp: 0,
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      })
    } else {
      console.log('missing creature fields')
    }

    setTimeout(() => {
      this.loadCreatures()
    }, 2000)

  }


  //* DELETE CREATURE

  deleteResponse: any;
  deleteErrorMessage: string | undefined;

  deleteCreature(id: string) {

    // update creatures rendered quicker, while the timeout runs
    this.creatures = this.creatures.filter(creature => creature._id !== id)

    this.postService.delete(id).subscribe({
      next: (response) => {
        this.deleteResponse = response;
        console.log('Creature deleted successfully', response)
      },
      error: (err) => {
        this.deleteErrorMessage = `Error: ${err.message}`;
        console.error('Error deleting creature', err)
      }
    })

    setTimeout(() => {
      this.loadCreatures()
    }, 2000)

  }




}
