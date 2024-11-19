import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DmService {

  creatureUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "creature"]'

  createUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/mutate/production'

  // Created in sanity, required for post methods
  token = 'sk1BdZuFL2Nn5b1aodFXyUVQVxDBS87jrwNarY5gcDDSiP8LHWL4pA2D52AddbEhafvRPMzNe0IPBXDgreZdtBvg4we46A3qxJ28MnCG45Lslh6xJZPfjT9lVU3xpgdsl3TG68hcAMtaWZZN83gvr6363BfN4S32Z07Ztj0DHnq3hGAGowfK'



  http = inject(HttpClient)

  getCreatures() {
    return this.http.get(this.creatureUrl)
  }

 
  updateHp(idString: string, value: any) {
    console.log(idString)
    console.log(value)

        // Format the request
        const postData = {
          mutations: [
            {
              patch: 
              {
                id: idString,
                set: {
                  hp: value
                }
              }
              
            }
          ]
        }
        console.log(postData)
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
        return this.http.post(this.createUrl, postData, { headers })
  }

}