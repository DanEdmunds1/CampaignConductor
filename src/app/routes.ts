import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateCharacterComponent } from './create-character/create-character.component';


const routeConfig: Routes = [
    // When you first enter the site, go straight to login page
    {
        path: '', redirectTo:'login', pathMatch:'full'
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
        path: 'createCharacter',
        component: CreateCharacterComponent,
        title: 'Creation'
    },

    // After login is successful, it will take us to Layout
    {
        path: '',
        component: LayoutComponent,
        title: 'Layout',
        // Any pages that can be displayed after a user has logged in, should a child of Layout
        children: [
            {
                path: 'charactersheet',
                component: CharacterSheetComponent,
                title: 'Character Sheet'
            }
        ]
    }
]
export default routeConfig;