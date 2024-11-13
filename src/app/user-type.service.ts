// user-type.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {

  constructor() { }

  // Method to check the user type from localStorage
  getUserType(): string {
    const userType = localStorage.getItem('userType');
    
    if (!userType) {
      return 'no-user';  // Default when no userType is in localStorage
    }

    return userType === 'true' ? 'true' : userType === 'false' ? 'false' : 'no-user';
  }
}