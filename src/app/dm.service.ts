import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DmService {

  creatureUrl = 'https://wsaa3peq.api.sanity.io/v2024-10-15/data/query/production?query=*[_type == "creature"]'

  http = inject(HttpClient)

  getCreatures() {
    return this.http.get(this.creatureUrl)
  }

  constructor() { }
}