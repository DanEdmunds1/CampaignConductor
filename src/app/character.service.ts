import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



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


  getCharacterWithMods(): Observable<any> {
    return this.getCharacters().pipe(
      map((data: any) => {
        // Find character from array whose campaignId matches that from localStorage
        const findChar = data.result.find((char: any) => char.campaignId === localStorage.getItem('campaignId'));

        if (!findChar) {
          throw new Error('Character not found');
        }

        // Calculate stat mods from character stats
        const calculateMod = (score: number): string => {
          const mod = Math.floor((score - 10) / 2); // Calculate the modifier
          // if mod is greater than 0, use +, else if mod is less than 0, use -, else display 0
          return mod > 0 ? `+${mod}` : mod < 0 ? `${mod}` : '0';
        };

        // calculateMod returns an object containing the stored character in findChar, and another object containing all the stat mods
        return {
          character: findChar,
          mods: {
            strMod: calculateMod(findChar.strength),
            dexMod: calculateMod(findChar.dexterity),
            conMod: calculateMod(findChar.constitution),
            intMod: calculateMod(findChar.intelligence),
            wisMod: calculateMod(findChar.wisdom),
            chaMod: calculateMod(findChar.charisma),
          }
        };
      })
    );
  }



  constructor() { }
}