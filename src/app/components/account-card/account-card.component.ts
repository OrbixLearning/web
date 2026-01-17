import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { InstitutionRolePipe } from '../../pipes/institution-role.pipe';
import { InstitutionService } from '../../services/institution.service';
import { UserService } from '../../services/user.service';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { LoadingComponent } from '../loading/loading.component';
import { ChangePasswordPopUpComponent } from '../pop-ups/change-password-pop-up/change-password-pop-up.component';

@Component({
	selector: 'o-account-card',
	imports: [LoadingComponent, InstitutionRolePipe, TextButtonComponent],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	service: UserService = inject(UserService);
	institutionService: InstitutionService = inject(InstitutionService);
	dialog: MatDialog = inject(MatDialog);

	@Input() self?: boolean;
	@Input() userAccountId?: string;
	@Input() email?: string;
	@Input() institution?: Institution | null;
	@Input() institutionRole?: InstitutionRoleEnum | null;
	@Input() idInInstitution?: string | null;

	amountOfClassrooms?: number;
	isLoading: boolean = false;

	ngOnInit() {
		this.getData();
	}

	get institutionLogoUrl(): string {
		return this.institutionService.getLogoUrl(this.institution?.id!);
	}

	async getData() {
		if (this.institution?.id && this.userAccountId) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.getAmountOfClassroomsInInstitutionByUserAccount(this.userAccountId, this.institution.id),
			)
				.then(amount => {
					this.amountOfClassrooms = amount;
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}

	changePassword() {
		this.dialog.open(ChangePasswordPopUpComponent, {
			data: {
				accountId: this.userAccountId!,
				email: this.email!,
			},
			minWidth: '500px',
		});
	}
}
