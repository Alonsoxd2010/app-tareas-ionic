import { Routes , PreloadAllModules, RouterModule} from '@angular/router';
import { NoAuthGuard } from './guards/no-auth-guard';
import { AuthGuard } from "./guards/auth-guard"
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage), canActivate: [NoAuthGuard],
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage), canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/tabs/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/tabs/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.page').then(m => m.SignUpPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/tabs/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/tabs/profile/profile.page').then(m => m.ProfilePage)
  },
];
