import { Component, inject, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { UserService } from '../../services/user.service';
import { LoadingComponent } from '../loading/loading.component';
import { InstitutionService } from '../../services/institution.service';

@Component({
	selector: 'o-account-card',
	imports: [LoadingComponent],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	service: UserService = inject(UserService);
	institutionService: InstitutionService = inject(InstitutionService);

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
		if (this.institution?.id) {
			this.isLoading = true;
			await lastValueFrom(this.service.getAmountOfClassroomsInInstitution(this.institution.id))
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
			case InstitutionRoleEnum.CREATOR:
				return 'Criador';
			case InstitutionRoleEnum.STUDENT:
				return 'Aluno';
			case InstitutionRoleEnum.TEACHER:
				return 'Professor';
			default:
				return undefined;
		}
	}
}
