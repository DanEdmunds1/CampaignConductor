# Campaign Conductor

## Description
This is the first project I have created since graduating from my Software Engineering Immersive Course at General Assembly. It is a full-stack application that allows people to track Dungeons and Dragons combat information online. This application comprises a Sanity Headless CMS and a front-end Angular interface that consumes the API with full CRUD capabilities.

## Deployment link: https://danedmunds1.github.io/CampaignConductor/

## Timeframe & Working Team (Solo/Pair/Group): This was an independent project which took 15 days to complete

## Technologies Used
Front-end: Angular, Typescript, SASS, HTML
Back-end/Database: Sanity Headless CMS
Development Tools: Excalidraw

## Brief
### Technical Requirements:
* Build a full-stack application by making your own backend and your own front-end
* Use a Sanity Headless CMS to serve and store your data
* Consume your API with a separate front-end built with Angular
* Implement CRUD functionality
* Be deployed online so it's publicly accessible
### Necessary Deliverables:
* A working application hosted on the internet
* A git repository hosted on GitHub, with a link to your hosted project, and frequent commits dating back to the very beginning of the project
* A readme.md file with:
  * An embedded screenshot of the app
  * Explanations of the technologies used
  * A couple of paragraphs about the general approach you took
  * Installation instructions for any dependencies
  * Link to your user stories/wireframes – sketches of major views/interfaces in your application
  * Link to your pitch deck/presentation – documentation of your wireframes, user stories, and proposed architecture
  * Descriptions of any unsolved problems or major hurdles you had to overcome
### Application-Specific Requirements:
* A user should be able to be either a player or a DM
* A player should be able to create a character and make attacks against the DM’s creatures
* A DM should be able to create creatures and make attacks against players’ characters
* All members of a campaign should be updated when a successful attack reduces the HP of the character or creature

## Planning

I wanted two primary pages, a Character Sheet, and a DM View
The Character Sheet would display all the necessary information for a user to inform their decisions during combat, i.e. their weapons, spells, stats, HP
The DM View would display all essential information for a DM to manage their creatures and target the characters in their campaign
I wanted to automate DnD combat from an attack perspective, i.e. allow players to make attacks over the internet, have the application calculate the damage based on the weapon or spell, reduce the target’s HP, and then update this new HP to the relevant party member

## Build/Code Process

### Content Management System
I created the Sanity CMS to store and serve data to the front end. I created schemas for all the documents I would be using and hosted them locally to ensure it was working as intended.

### Character Sheet
This is the part of the project I spent the most time on as it is very information dense. Many different documents had to be fetched using HTTP requests to the CMS in Angular service files, and then loaded, manipulated, and rendered to the user in meaningful ways.

The basic character information was simple to render, i.e. a character’s name, image, class, background, race, alignment, level, stats, etc. I then had to use some of this data to calculate other important pieces of information, i.e. taking the character’s stats (strength, dexterity, constitution, intelligence, wisdom, charisma) and displaying the correct modifiers, saving throws, and skills.
One particular example of this is the Spellcasting section of the Character Sheet. I wanted it to display the character’s spellcasting ability (the highest spell-related stat, e.g. intelligence, wisdom, or charisma), spell save DC, and attack bonus, none of which are stored in the document, but can be calculated with other character data:

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
  
## HTTP Requests
I created services to carry out HTTP requests so they were accessible to all components. There are requests to create, read, update, and delete, providing full CRUD capability.

    learnSpell(idString: string, owner: any) {
      console.log(idString)
      console.log(owner)
    
    const postData = {
      mutations: [
        {
          patch: {
            id: idString,
            insert: {
              after: 'owners[-1]',
              items: [
                owner
              ]
            }
          }
         
        }
      ]
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.post(this.createUrl, postData, { headers })
    }

This snippet shows the function used when a character learns a spell. Learning a spell takes the form of inserting the character’s ID into the ‘owners’ array of a particular spell. A character’s spells are rendered by searching through all spell documents and returning ones that contain the character’s ID in their ‘owners’ array.
The function passes in the spell’s id as ‘idString’, and inserts a new object containing the character id (passed through the ‘owner’ parameter), at the 0 index of the ‘owners’ array. The request also requires Content-Type and Authorization headers, which are passed in the .post parameters alongside the correct Sanity URL and the data.


## DM View
This page shows the DM all the information required to manage attacks from their creatures against characters in their campaign. It allows the user to create creatures, delete creatures, and make attacks with creatures.

    getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    rollDmg(dice: string): number {
      const regex = /^(\d+)d(\d+)$/;
      const match = dice.match(regex)

    if (match) {
      // parse string to number via regex expression, 10 specifies radix in which number is represented
      const diceNum = parseInt(match[1], 10)
      const sidesNum = parseInt(match[2], 10)

      let total = 0

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

These functions take the stored value of the damage dice that a DM can select when making an attack, i.e. ‘2d6’, and ensure that 2 x D6 die are rolled. To achieve this I used a regex expression to deconstruct the string in which all dice are stored. Then the function parses the string into the relevant numbers to be used for the number of dice rolled and the number of sides each dice has. For each number of dice, the function will get a random number between 1 and the number of sides, emulating the results of a real dice roll, and returning the total amount of damage to be passed to the target character, if the attack roll hits them.

## Challenges
This project was particularly challenging because I had never used Angular, Typescript, or Sanity before, and all that know about them now I taught myself. The main difficulty of this was that there wasn’t a huge amount of documentation on how Angular and Sanity talk to each other via HTTP requests, leading to a large amount of trial and error. One example of this challenge that I found a solution for was writing the function to remove a spell from a character’s spell list, but not deleting the spell entirely.
I wanted to make adding spells to a character as easy as possible, so I created some spell documents that exist in DnD and allowed users to access them via a dropdown. Users could click on the spell, which would insert their character’s ID into the spell’s ‘owners’ array field.  Then, because a character’s current spells are populated via a function that looks through all spells and returns the spells in which the character ID is found, the newly added spell would appear on the character sheet.
Removing the spell proved to be a challenge because it is a lot easier to add a value to a field in Sanity than it is to select a value to remove via its content or ID. Sanity’s ‘unset’ method is a powerful tool for this use case but it can only remove an item from an array via its index in said array. I was pretty frustrated at this point, as I’d been looking for a method like this for hours, so I was determined to make it work. I realised that while Sanity couldn’t identify an element in an array via its value, it could easily be done in TS. 
    for (let i = 0; i < owners.length; i++) {
      if (owners[i]['owner'] === localStorage.getItem('userId')) {
        ownerIndex = i
      }
    }
Writing a loop like this reminded me of all the coding puzzles we had to complete at General Assembly to improve our problem-solving skills.
I was then able to pass this index into a function that could dynamically remove the userId from the 'owners' array of whatever spell was selected.

## Wins
A major win was being able to create a functional application using Typescript, Angular, and Sanity CMS, as I had never used any of these before. During my time learning with General Assembly, we would be taught how each technology works and practice with them before we used them to create a project. But this time I learned it all myself via documentation and forums and created a project much earlier than I had before.
Another win was overcoming the spell-related challenge I wrote about earlier in the ReadMe. I love getting HTTP requests to work dynamically and it took a long time to figure out how to correctly structure the data I was updating.

Key Learnings/Takeaways
This project gave me a great opportunity to become more familiar with Angular, Typescript, and Sanity CMS as previously stated, but I also learned a lot more about HTTP requests even though I have used them in prior projects. As a result, I feel more comfortable using these tools and I was able to better fix issues surrounding them when things in my application did not work.

## Bugs
I will be having people use and test this application soon to test for bugs and receive feedback

## Future Improvements

### Initiatives
A state in which characters and creatures in a campaign are “in combat”, and in this state each character and creature is given a value between 1 and 20ish. A campaign member with the highest initiative value would be able to attack first, and after the attack has been made, regardless of whether it is successful, the member with the next highest initiative value gets to make their attack. All members except that whose ‘turn’ it is to attack, are not able to make attacks while they are “in combat”. This would make the application more true to an actual DnD game.

### Inventory View
A page in which a character’s inventory is rendered. On this page, a character can see their tools, languages, equipment, treasure, allies, organisations, backstory, features, and traits. Because these aspects of a character are not fundamental to combat I did not include this in the application, but it would serve well as a future improvement.
