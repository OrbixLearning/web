import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { institutionGuard } from './guards/institution.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./views/main/main.component').then(m => m.MainComponent),
		canActivate: [authGuard],
		children: [
			{
				path: '',
				loadComponent: () => import('./views/main/home/home.component').then(m => m.HomeComponent),
			},
			{
				path: 'i/:institutionId',
				loadComponent: () =>
					import('./views/main/institution/institution.component').then(m => m.InstitutionComponent),
				canActivate: [institutionGuard],
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./views/main/institution/institution-home/institution-home.component').then(
								m => m.InstitutionHomeComponent,
							),
					},
					{
						path: 'settings',
						loadComponent: () =>
							import('./views/main/institution/institution-settings/institution-settings.component').then(
								m => m.InstitutionSettingsComponent,
							),
					},
				],
			},
		],
	},
	{
		path: 'login',
		loadComponent: () => import('./views/login-layout/login-layout.component').then(m => m.LoginLayoutComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./views/login-layout/login/login.component').then(m => m.LoginComponent),
			},
			{
				path: 'register',
				loadComponent: () =>
					import('./views/login-layout/register/register.component').then(m => m.RegisterComponent),
			},
			{
				path: 'forgot-password',
				loadComponent: () =>
					import('./views/login-layout/forgot-password/forgot-password.component').then(
						m => m.ForgotPasswordComponent,
					),
			},
			{
				path: 'reset-password/:token',
				loadComponent: () =>
					import('./views/login-layout/reset-password/reset-password.component').then(
						m => m.ResetPasswordComponent,
					),
			},
			{
				path: 'oauth-callback',
				loadComponent: () =>
					import('./views/login-layout/oauth-callback/oauth-callback.component').then(
						m => m.OAuthCallbackComponent,
					),
			},
		],
	},
	{
		path: 'error',
		loadComponent: () => import('./views/error/error.component').then(m => m.ErrorComponent),
	},
	{
		path: '**',
		redirectTo: 'error',
	},
];
