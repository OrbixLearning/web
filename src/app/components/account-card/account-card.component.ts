import { Component, inject, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { UserService } from '../../services/user.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	selector: 'o-account-card',
	imports: [LoadingComponent],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	service: UserService = inject(UserService);

	@Input() email?: string;
	@Input() institution?: Institution;
	@Input() institutionRole?: InstitutionRoleEnum;

	amountOfClassrooms?: number;
	isLoading: boolean = false;

	ngOnInit() {
		this.getData();
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
