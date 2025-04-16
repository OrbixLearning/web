import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/main/main.component').then((m) => m.MainComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./views/main/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'oauth-callback',
    loadComponent: () =>
      import('./views/oauth-callback/oauth-callback.component').then(
        (m) => m.OAuthCallbackComponent
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./views/error/error.component').then((m) => m.ErrorComponent),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
