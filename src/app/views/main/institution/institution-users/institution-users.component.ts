import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { FilterMetadata } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { PasswordResetPopUpComponent } from '../../../../components/pop-ups/password-reset-pop-up/password-reset-pop-up.component';
import { UserCreationPopUpComponent } from '../../../../components/pop-ups/user-creation-pop-up/user-creation-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { InstitutionRoleEnum } from '../../../../enums/InstitutionRole.enum';
import { Page } from '../../../../models/Page';
import { User, UserAccount } from '../../../../models/User';
import { ContextService } from '../../../../services/context.service';
import { UserService } from '../../../../services/user.service';
import { InstitutionRolePipe } from '../../../../pipes/institution-role.pipe';

@Component({
	selector: 'o-institution-users',
	imports: [
		MatButtonModule,
		MatIconModule,
		TableModule,
		SelectModule,
		FormsModule,
		RouterModule,
		LoadingComponent,
		InputTextModule,
		TooltipModule,
		AvatarComponent,
		SubHeaderComponent,
		InstitutionRolePipe,
	],
	templateUrl: './institution-users.component.html',
	styleUrl: './institution-users.component.scss',
})
export class InstitutionUsersComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	service: UserService = inject(UserService);
	cd: ChangeDetectorRef = inject(ChangeDetectorRef);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	page?: Page<UserAccount>;
	accounts: UserAccount[] = [];
	totalRecords: number = 0;
	roles: InstitutionRoleEnum[] = Object.values(InstitutionRoleEnum);
	rolesFilter?: InstitutionRoleEnum;
	selectedUsers: UserAccount[] = [];
	paginationFirst: number = 0;

	get tableStyle() {
		return {
			'min-width': '50rem',
			'margin-bottom': '140px', // To avoid the scroll when editing a cell
		};
	}

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		buttons.push({
			text: 'Criar usuários',
			icon: 'add',
			function: () => this.createUser(),
			highlighted: true,
		});
		buttons.push({
			text: 'Excluir usuários',
			icon: 'delete',
			function: () => this.deleteSelectedUsers(),
			highlighted: false,
			disabled: this.selectedUsers.length === 0,
		});
		return buttons;
	}

	getProfilePictureUrl(user: User): string {
		return this.service.getProfilePictureUrl(user);
	}

	async getAccounts(event?: TableLazyLoadEvent) {
		if (!this.ctx.institution?.id) return;

		let page;
		let size;
		if (event?.first !== undefined && event?.rows != undefined) {
			page = event.first / event.rows;
			size = event.rows;
		} else {
			page = this.page?.number || 0;
			size = this.page?.size || 10;
		}

		let idInInstitutionFilter: string = (event?.filters?.['idInInstitution'] as FilterMetadata)?.value || '';
		let emailFilter: string = (event?.filters?.['email'] as FilterMetadata)?.value || '';
		let nameFilter: string = (event?.filters?.['name'] as FilterMetadata)?.value || '';
		let roleFilter: InstitutionRoleEnum = (event?.filters?.['role'] as FilterMetadata)?.value || '';

		this.isLoading = true;
		this.cd.detectChanges();
		await lastValueFrom(
			this.service.getInstitutionUsers(
				this.ctx.institution.id,
				page,
				size,
				idInInstitutionFilter,
				emailFilter,
				nameFilter,
				roleFilter,
			),
		)
			.then((res: Page<UserAccount>) => {
				this.page = res;
				this.accounts = this.page.content;
				this.totalRecords = this.page.totalElements;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	createUser() {
		this.dialog
			.open(UserCreationPopUpComponent, {
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe(async res => {
				if (res) {
					await this.getAccounts();
				}
			});
	}

	deleteSelectedUsers() {
		let data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir ${this.selectedUsers.length} usuário${
				this.selectedUsers.length > 1 ? 's' : ''
			}?`,
			message: `Essa ação não pode ser desfeita!`,
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async r => {
				if (r) {
					this.isLoading = true;
					this.cd.detectChanges();
					await lastValueFrom(this.service.deleteUserAccounts(this.selectedUsers.map(u => u.id)))
						.then(() => {
							this.selectedUsers = [];
							this.getAccounts();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	resetPassword(account: UserAccount) {
		this.dialog.open(PasswordResetPopUpComponent, { data: account });
	}

	async updateAccount(account: UserAccount) {
		this.isLoading = true;
		this.cd.detectChanges();
		await lastValueFrom(
			this.service.updateAccount(
				account.id,
				account.email,
				account.idInInstitution || '',
				account.institutionRole!,
			),
		)
			.then(() => {})
			.catch(async () => {
				await this.getAccounts();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
