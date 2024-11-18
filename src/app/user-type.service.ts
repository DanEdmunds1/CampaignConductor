import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// localStorage is not available in server-side rendering context, these imports ensure that any code that accesses localStorage is only executed on the client side

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getUserType(): string {
    if (isPlatformBrowser(this.platformId)) {
      // Safely access localStorage here
      return localStorage.getItem('userType') || 'default';
    } else {
      // Handle SSR scenario or return a default value
      return 'default';
    }
  }
}