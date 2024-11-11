import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.scss'
})
export class CreateCharacterComponent {

  postService = inject(PostService)

  createdCharacter: any = ''


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
      maxHp: new FormControl(0),
      image: new FormControl('')

    })

    postResponse: any;
    errorMessage: string | undefined;

    createCharacter() {
      this.createdCharacter = this.createCharacterForm.value
      const content = this.createCharacterForm.value

      const content2 = {
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
        maxHp: this.createCharacterForm.value.maxHp,
        name: this.createCharacterForm.value.name,
        race: this.createCharacterForm.value.race,
        strength: this.createCharacterForm.value.strength,
        wisdom: this.createCharacterForm.value.wisdom,
        _type: 'character'
      }

      console.log(content)

      this.postService.createCharacter(content2).subscribe({
        next: (response) => {
          this.postResponse = response;
          console.log('Character created successfully', response)
        },
        error: (err) => {
          this.errorMessage = `Error: ${err.message}`;
          console.error('Error creating character', err)
        }
      })
    }

//post type
//content
    

}
