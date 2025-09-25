import { Component, inject, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { InstitutionService } from '../../services/institution.service';
import { UserService } from '../../services/user.service';
import { LoadingComponent } from '../loading/loading.component';
import { UserAccount } from '../../models/User';

@Component({
	selector: 'o-account-card',
	imports: [LoadingComponent],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	service: UserService = inject(UserService);
	institutionService: InstitutionService = inject(InstitutionService);

	@Input() userAccountId?: string;
	@Input() email?: string;
	@Input() institution?: Institution | null;
	@Input() institutionRole?: InstitutionRoleEnum | null;
	@Input() idInInstitution?: string | null;
	@Input() account!: UserAccount;
	@Input() showAvatar: boolean = true;

	amountOfClassrooms?: number;
	isLoading: boolean = false;
	userService: UserService = inject(UserService);

	ngOnInit() {
		this.getData();
	}

	get institutionLogoUrl(): string {
		return this.institutionService.getLogoUrl(this.institution?.id!);
	}

	get profilePictureUrl(): string {
		if (!this.account || !this.account.user) {
		return 'assets/placeholder/user.png';
		}
		return this.userService.getProfilePictureUrl(this.account.user);
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

	institutionRoleText(): string | undefined {
		switch (this.institutionRole) {
			case InstitutionRoleEnum.ADMIN:
				return 'Administrador';
			case InstitutionRoleEnum.STUDENT:
				return 'Aluno';
			case InstitutionRoleEnum.TEACHER:
				return 'Professor';
			default:
				return undefined;
		}
	}
}
