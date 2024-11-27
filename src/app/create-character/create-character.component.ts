import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.scss'
})
export class CreateCharacterComponent {

    // Allow use of router when login is successful
    constructor(private router: Router) {

    }
  

  postService = inject(PostService)


    // Create the form object
    createCharacterForm = new FormGroup({
      name: new FormControl(''),
      level: new FormControl(0),
      class: new FormControl(''),
      background: new FormControl(''),
      race: new FormControl(''),
      alignment: new FormControl(''),
  
      // Stats
      strength: new FormControl(0),
      dexterity: new FormControl(0),
      constitution: new FormControl(0),
      intelligence: new FormControl(0),
      wisdom: new FormControl(0),
      charisma: new FormControl(0),
  
      // Left column
      AC: new FormControl(0),
      initiative: new FormControl(0),
      hp: new FormControl(0),
      image: new FormControl(''),

      campaignId: new FormControl(''),
      owner: new FormControl('')

    })

    // Initialise variables to store api responses
    postResponse: any;
    errorMessage: string | undefined;

    // Function that collates all data from the form, uses the post function post service, and logs success or error

    createCharacter() {

      const content = {
        AC: this.createCharacterForm.value.AC,
        alignment: this.createCharacterForm.value.alignment,
        background: this.createCharacterForm.value.background,
        charisma: this.createCharacterForm.value.charisma,
        class: this.createCharacterForm.value.class,
        constitution: this.createCharacterForm.value.constitution,
        dexterity: this.createCharacterForm.value.dexterity,
        image: this.createCharacterForm.value.image,
        initiative: this.createCharacterForm.value.initiative,
        intelligence: this.createCharacterForm.value.intelligence,
        level: this.createCharacterForm.value.level,
        maxHp: this.createCharacterForm.value.hp,
        hp: this.createCharacterForm.value.hp,
        hitdice: this.createCharacterForm.value.level,
        name: this.createCharacterForm.value.name,
        race: this.createCharacterForm.value.race,
        strength: this.createCharacterForm.value.strength,
        wisdom: this.createCharacterForm.value.wisdom,
        campaignId: localStorage.getItem('campaignId'),
        owner: localStorage.getItem('userId'),
        _type: 'character'
      }

      // Check if all fields have non-empty values
    const allFieldsFilled = Object.values(content).every(value => value !== null && value !== undefined && value !== '');

    if (allFieldsFilled) {
            this.postService.post(content).subscribe({
        next: (response) => {
          this.postResponse = response;
          console.log('Character created successfully', response)
          this.router.navigateByUrl('/charactersheet')
        },
        error: (err) => {
          this.errorMessage = `Error: ${err.message}`;
          console.error('Error creating character', err)
        }
      })
    } else {
      console.log('missing fields')
    }


    }



}
