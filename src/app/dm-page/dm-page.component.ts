import { Component, inject } from '@angular/core';
import { DmService } from '../dm.service';
import { CharacterService } from '../character.service';

// allows us to use *ngFor
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


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
  // Create array in which to store the creatures returned by the http call
  creatures: any[] = []


  // inject character service, return characters with a matching campaign id
  characterService: CharacterService = inject(CharacterService)
  // Create array in which to store the characters returned by the http call
  characters: any[] = []




  ngOnInit(): void {
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
      },
    )
  }



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

  // Function that collates all data from the form
  getAtkInfo() {
    this.attack = this.attackForm.value
    console.log(this.attack)
    this.rollAttack(this.attack)

  }

  rollAttack(atk: any) {
    const hit = Math.floor(Math.random() * 20) + 1

    // store target of the attack in a variable
    const target = this.characters.find((char) => char.name === atk.target)

   


    if (target) {
      console.log(target)
      console.log(hit)
      if (hit + atk.atkMod >= target.AC) {
        console.log('hit')
      } else {
        console.log('miss')
      }
  
    } else {
      console.log('no')
    }


  }




  constructor() { }


}
