import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { classroomGuard } from './guards/classroom.guard';
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
				path: 'settings',
				loadComponent: () => import('./views/main/settings/settings.component').then(m => m.SettingsComponent),
			},
			{
				path: 'profile',
				loadComponent: () => import('./views/main/profile/profile.component').then(m => m.ProfileComponent),
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
					{
						path: 'users',
						loadComponent: () =>
							import('./views/main/institution/institution-users/institution-users.component').then(
								m => m.InstitutionUsersComponent,
							),
					},
					{
						path: 'classrooms',
						loadComponent: () =>
							import(
								'./views/main/institution/institution-classrooms/institution-classrooms.component'
							).then(m => m.InstitutionClassroomsComponent),
					},
					{
						path: 'c/:classroomId',
						loadComponent: () =>
							import('./views/main/classroom/classroom.component').then(m => m.ClassroomComponent),
						canActivate: [classroomGuard],
						children: [
							{
								path: '',
								loadComponent: () =>
									import('./views/main/classroom/classroom-home/classroom-home.component').then(
										m => m.ClassroomHomeComponent,
									),
							},
							{
								path: 'settings',
								loadComponent: () =>
									import(
										'./views/main/classroom/classroom-settings/classroom-settings.component'
									).then(m => m.ClassroomSettingsComponent),
							},
						],
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
