import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { classroomTeacherGuard } from './guards/classroom-teacher.guard';
import { classroomGuard } from './guards/classroom.guard';
import { institutionAdminGuard } from './guards/institution-admin.guard';
import { institutionGuard } from './guards/institution.guard';
import { learningPathStudyGuard } from './guards/learning-path-study.guard';

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
				path: 'profile/:userId',
				loadComponent: () => import('./views/main/profile/profile.component').then(m => m.ProfileComponent),
			},
			{
				path: 'link-account-callback',
				loadComponent: () =>
					import('./views/main/profile/link-account-callback/link-account-callback.component').then(
						m => m.LinkAccountCallbackComponent,
					),
			},
			{
				path: 'report',
				loadComponent: () => import('./views/main/report/report.component').then(m => m.ReportComponent),
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
						canActivate: [institutionAdminGuard],
					},
					{
						path: 'users',
						loadComponent: () =>
							import('./views/main/institution/institution-users/institution-users.component').then(
								m => m.InstitutionUsersComponent,
							),
						canActivate: [institutionAdminGuard],
					},
					{
						path: 'classrooms',
						loadComponent: () =>
							import(
								'./views/main/institution/institution-classrooms/institution-classrooms.component'
							).then(m => m.InstitutionClassroomsComponent),
						canActivate: [institutionAdminGuard],
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
								canActivate: [classroomTeacherGuard],
							},
							{
								path: 'members',
								loadComponent: () =>
									import('./views/main/classroom/classroom-members/classroom-members.component').then(
										m => m.ClassroomMembersComponent,
									),
							},
							{
								path: 'documents',
								loadComponent: () =>
									import(
										'./views/main/classroom/classroom-documents/classroom-documents.component'
									).then(m => m.ClassroomDocumentsComponent),
							},
							{
								path: 'lp/:learningPathId',
								loadComponent: () =>
									import('./views/main/learning-path/learning-path.component').then(
										m => m.LearningPathComponent,
									),
								canActivate: [learningPathStudyGuard],
							},
							{
								path: 'dashboard',
								loadComponent: () =>
									import(
										'./views/main/classroom/classroom-dashboard/classroom-dashboard.component'
									).then(m => m.ClassroomDashboardComponent),
								canActivate: [classroomTeacherGuard],
								children: [
									{
										path: '',
										loadComponent: () =>
											import(
												'./views/main/classroom/classroom-dashboard/home-dashboard/home-dashboard.component'
											).then(m => m.HomeDashboardComponent),
									},
									{
										path: 'syllabus/:syllabusId',
										loadComponent: () =>
											import(
												'./views/main/classroom/classroom-dashboard/syllabus-dashboard/syllabus-dashboard.component'
											).then(m => m.SyllabusDashboardComponent),
									},
									{
										path: 'student/:studentId',
										loadComponent: () =>
											import(
												'./views/main/classroom/classroom-dashboard/student-dashboard/student-dashboard.component'
											).then(m => m.StudentDashboardComponent),
									},
								],
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
