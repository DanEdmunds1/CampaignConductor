import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }


  http = inject(HttpClient)

  // API end point for any post methods
  createUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/mutate/production'


  // Created in sanity, required for post methods
  token = 'sk1BdZuFL2Nn5b1aodFXyUVQVxDBS87jrwNarY5gcDDSiP8LHWL4pA2D52AddbEhafvRPMzNe0IPBXDgreZdtBvg4we46A3qxJ28MnCG45Lslh6xJZPfjT9lVU3xpgdsl3TG68hcAMtaWZZN83gvr6363BfN4S32Z07Ztj0DHnq3hGAGowfK'

  post(content: any) {


    // Formats the data to be created, does not include contnent type, that must be added in the relevant component TS
    const postData = {
      mutations: [
        {
          create: content
        }
      ]
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post(this.createUrl, postData, { headers })
  }

  createUser(user: any) {
    return this.http.post(this.createUrl, user)
  }

  createSkills(skills: any) {
    return this.http.post(this.createUrl, skills)
  }
  createSavingThrows(savingThrows: any) {
    return this.http.post(this.createUrl, savingThrows)
  }


}
