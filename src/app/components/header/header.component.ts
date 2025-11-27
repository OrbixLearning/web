import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Event, NavigationEnd, Router, RouterEvent, RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { filter, lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { Notification } from '../../models/Notification';
import { Page } from '../../models/Page';
import { ContextService } from '../../services/context.service';
import { InstitutionService } from '../../services/institution.service';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { LoadingComponent } from '../loading/loading.component';
import { NotificationCardComponent } from '../notification-card/notification-card.component';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../pop-ups/confirm-pop-up/confirm-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'o-header',
	imports: [
		MatIconModule,
		MatButtonModule,
		SelectModule,
		FormsModule,
		RouterModule,
		AvatarComponent,
		PopoverModule,
		LoadingComponent,
		TextButtonComponent,
		NotificationCardComponent,
		MatBadgeModule,
	],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	theme: ThemeService = inject(ThemeService);
	institutionService: InstitutionService = inject(InstitutionService);
	userService: UserService = inject(UserService);
	notificationService: NotificationService = inject(NotificationService);
	route: ActivatedRoute = inject(ActivatedRoute);
	dialog: MatDialog = inject(MatDialog);

	@Output() sidebar: EventEmitter<void> = new EventEmitter<void>();

	institutionId?: string;
	personalInstitution: Institution = {
		id: null,
		name: 'Pessoal',
		domains: [],
		lms: null,
		style: null,
	};
	selectedInstitutionId: string | null = this.personalInstitution.id;
	notifications: Notification[] = [];
	loadingNotifications: boolean = false;

	constructor() {
		this.setInstitution();
	}

	ngOnInit() {
		this.refreshNotifications();
		this.setThemes();
		// This is used to update the data when the institutionId changes in the URL
		this.router.events
			.pipe(filter((e: Event | RouterEvent): e is RouterEvent => e instanceof NavigationEnd))
			.subscribe((e: RouterEvent) => {
				this.setInstitution();
				this.setThemes();
			});
	}

	get sortedContextInstitutions(): Institution[] {
		return this.ctx.institutionList?.sort((a, b) => a.name.localeCompare(b.name)) || [];
	}

	get institutions(): Institution[] {
		let arr: Institution[] = [this.personalInstitution];
		arr.push(...this.sortedContextInstitutions);
		return arr;
	}

	get logo(): string {
		return this.ctx.institution?.id
			? this.institutionService.getLogoUrl(this.ctx.institution.id)
			: 'assets/logos/white-logo.png';
	}

	get canConfigureInstitution(): boolean {
		if (!this.ctx.institution?.id || !this.ctx.institutionRoles) {
			return false;
		}
		return this.ctx.institutionRoles!.includes(InstitutionRoleEnum.ADMIN);
	}

	get profilePictureUrl(): string {
		if (!this.ctx.user) return '';
		return this.userService.getProfilePictureUrl(this.ctx.user!);
	}

	get unreadNotificationsCount(): number {
		return this.notifications.filter(n => !n.read).length;
	}

	setInstitution() {
		const urlSegments = this.router.url.split('/');
		this.institutionId = urlSegments.length > 2 && urlSegments[1] === 'i' ? urlSegments[2] : undefined;
		if (this.institutionId) this.selectedInstitutionId = this.ctx.institution!.id;
	}

	setThemes() {
		if (this.ctx.institution?.id) this.theme.setInstitutionTheme(this.ctx.institution);
		else this.theme.setBaseTheme();
	}

	changeInstitution(institutionId: string | null) {
		this.ctx.institution = this.institutions.find(inst => inst.id === institutionId) || this.personalInstitution;
		if (institutionId) {
			this.router.navigate(['/i/' + institutionId]);
		} else {
			this.router.navigate(['/']);
		}
	}

	goToSettings() {
		this.ctx.clearClassroom();
		if (this.ctx.institution?.id) {
			this.router.navigate(['/i/' + this.ctx.institution.id + '/settings']);
		} else {
			this.router.navigate(['/settings']);
		}
	}

	goToHome() {
		this.ctx.clearClassroom();
		if (this.ctx.institution?.id) {
			this.router.navigate(['/i/' + this.ctx.institution.id]);
		} else {
			this.router.navigate(['/']);
		}
	}

	goToReport() {
		this.ctx.clearClassroom();
		this.router.navigate(['/report']);
	}

	async clearNotifications() {
		const data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja remover todas as notificações?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Remover',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean) => {
				if (result) {
					this.loadingNotifications = true;
					await lastValueFrom(this.notificationService.deletes())
						.then(() => {
							this.notifications = [];
						})
						.finally(() => (this.loadingNotifications = false));
				}
			});
	}

	async refreshNotifications() {
		this.loadingNotifications = true;
		await lastValueFrom(this.notificationService.get(0, 20))
			.then((response: Page<Notification>) => {
				this.notifications = response.content;
			})
			.finally(() => (this.loadingNotifications = false));
	}

	async deleteNotification(notification: Notification) {
		const data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja remover essa notificação?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Remover',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean) => {
				if (result) {
					this.loadingNotifications = true;
					await lastValueFrom(this.notificationService.delete(notification.id))
						.then(() => {
							this.notifications = this.notifications.filter(n => n.id !== notification.id);
						})
						.finally(() => (this.loadingNotifications = false));
				}
			});
	}
}
