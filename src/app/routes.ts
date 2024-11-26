import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { LoginComponent } from './login/login.component';
import { CreateCharacterComponent } from './create-character/create-character.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DmPageComponent } from './dm-page/dm-page.component';
import { LogoutComponent } from './logout/logout.component';


const routeConfig: Routes = [
    // When you first enter the site, go straight to login page
    {
        path: '', redirectTo:'home', pathMatch:'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        title: ' Home Page'
    },
    {
        path: 'charactersheet',
        component: CharacterSheetComponent,
        title: 'Character Sheet'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'signup',
        component: SignUpComponent,
        title: 'Sign Up'
    },
    {
        path: 'createCharacter',
        component: CreateCharacterComponent,
        title: 'Creation'
    },
    {
        path: 'dm-page',
        component: DmPageComponent,
        title: 'DM Page'
    },
    {
        path: 'logout',
        component: LogoutComponent,
        title: 'Logout'
    },

]
export default routeConfig;