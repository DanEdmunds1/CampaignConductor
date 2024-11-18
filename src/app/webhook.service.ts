import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private lastUpdateTime = Date.now(); // Store the timestamp of the last known update

  constructor(private http: HttpClient) {}

  checkForUpdates(): Observable<any> {
    console.log('checking for updates')
    return interval(5000).pipe(  // Poll every 5 seconds
      switchMap(() => 
        this.http.get(`https://5206-86-20-88-18.ngrok-free.app/structure/character;7c82d01d-bca5-494d-8af9-65219f564308`)
      )
    );
  }
}
