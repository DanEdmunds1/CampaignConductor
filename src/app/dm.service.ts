import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DmService {

  creatureUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "creature"]'

  deleteUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/mutate/production'

  createUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/mutate/production'

  // Created in sanity, required for post methods
  token = 'sk1BdZuFL2Nn5b1aodFXyUVQVxDBS87jrwNarY5gcDDSiP8LHWL4pA2D52AddbEhafvRPMzNe0IPBXDgreZdtBvg4we46A3qxJ28MnCG45Lslh6xJZPfjT9lVU3xpgdsl3TG68hcAMtaWZZN83gvr6363BfN4S32Z07Ztj0DHnq3hGAGowfK'



  http = inject(HttpClient)

  getCreatures() {
    return this.http.get(this.creatureUrl)
  }

  deleteCreature(idString: string) {
    console.log(idString)
    // Format the request
    const postData = {
      mutations: [
        {
          delete: 
          {
            id: idString
          }
          
        }
      ]
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.post(this.deleteUrl, postData, { headers })
  }

  // createCreature(content: any) {
  //   console.log(content)

  //   const postData = {
  //     mutations: [
  //       {
  //         create: content
  //       }
  //     ]
  //   }

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${this.token}`
  //   })

  //   return this.http.post(this.createUrl, postData, { headers })
  // }


}