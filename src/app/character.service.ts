import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  characterUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "character"]'

  skillsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "skills"]'

  savingThrowsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "savingThrows"]'

  weaponsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "weapon"]'

  spellsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "spell"]'

  

  http = inject(HttpClient)

  getCharacters() {
    return this.http.get(this.characterUrl)
  }

  getSkills() {
    return this.http.get(this.skillsUrl)
  }

  getSavingThrows() {
    return this.http.get(this.savingThrowsUrl)
  }

  getWeapons() {
    return this.http.get(this.weaponsUrl)
  }

  getSpells() {
    return this.http.get(this.spellsUrl)
  }






  constructor() { }
}