import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  characterUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "character"]'

  weaponsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "weapon"]'

  spellsUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "spell"]'

  

  http = inject(HttpClient)

  getCharacters() {
    return this.http.get(this.characterUrl)
  }

  getSpells() {
    return this.http.get(this.spellsUrl)
  }

  getWeapons() {
    return this.http.get(this.weaponsUrl)
  }

  getWeaponsForChar(): Observable<any> {
    return this.getWeapons().pipe(
      map((data: any) => {
        const weapons = data.result.filter((w: any) => w.owner === localStorage.getItem('userId'))

        if (weapons.length === 0) {
          throw new Error('no weapons found')
        }

        return weapons

      })
    )
  }

  getCharacterWithMods(): Observable<any> {
    return this.getCharacters().pipe(
      map((data: any) => {
        // Find character from array whose owner field matches the userId localStorage
        const char = data.result.find((c: any) => c.owner === localStorage.getItem('userId'));

        if (!char) {
          throw new Error('Character not found');
        }

        // Calculate stat mods from character stats
        const calculateMod = (score: number): string => {
          const mod = Math.floor((score - 10) / 2); // Calculate the modifier
          // if mod is greater than 0, use +, else if mod is less than 0, use -, else display 0
          return mod > 0 ? `+${mod}` : mod < 0 ? `${mod}` : '0';
        };

        // calculateMod returns an object containing the stored character in char, and another object containing all the stat mods
        return {
          character: char,
          mods: {
            strMod: calculateMod(char.strength),
            dexMod: calculateMod(char.dexterity),
            conMod: calculateMod(char.constitution),
            intMod: calculateMod(char.intelligence),
            wisMod: calculateMod(char.wisdom),
            chaMod: calculateMod(char.charisma),
          }
        };
      })
    );
  }

    // generate a random integer between min and max inclusive
    getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

   // parse dice roll string and generate damage
   rollDice(dice: string): number {

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

  constructor() { }
}