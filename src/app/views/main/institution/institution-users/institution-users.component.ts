import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { Page } from '../../../../models/Page';
import { UserAccount } from '../../../../models/User';
import { ContextService } from '../../../../services/context.service';
import { InstitutionService } from '../../../../services/institution.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationPopUpComponent } from '../../../../components/pop-ups/user-creation-pop-up/user-creation-pop-up.component';

@Component({
	selector: 'o-institution-users',
	imports: [MatButtonModule, MatIconModule, TableModule, SelectModule],
	templateUrl: './institution-users.component.html',
	styleUrl: './institution-users.component.scss',
})
export class InstitutionUsersComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	service: InstitutionService = inject(InstitutionService);
	cd: ChangeDetectorRef = inject(ChangeDetectorRef);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	page?: Page<UserAccount>;
	accounts: UserAccount[] = [];
	totalRecords: number = 0;

	get tableStyle() {
		return {
			'min-width': '50rem',
		};
	}

	async getAccounts(event?: TableLazyLoadEvent) {
		if (!this.ctx.institution?.id) return;

		const page = event?.first ? event?.first / event?.rows! : 0;
		const size = event?.rows || 10;

		this.isLoading = true;
		this.cd.detectChanges();
		await lastValueFrom(this.service.getInstitutionUsers(this.ctx.institution.id, page, size))
			.then((res: Page<UserAccount>) => {
				this.page = res;
				this.accounts = this.page.content;
				this.totalRecords = this.page.totalElements;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	goBack() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/settings']);
	}

	createUser() {
		this.dialog
			.open(UserCreationPopUpComponent, {})
			.afterClosed()
			.subscribe(res => {});
	}

	deleteSelectedUsers() {}
}
