import { Component, Input } from '@angular/core';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';

@Component({
	selector: 'o-account-card',
	imports: [],
	templateUrl: './account-card.component.html',
	styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
	@Input() email?: string;
	@Input() institution?: Institution;
	@Input() institutionRole?: InstitutionRoleEnum;
	@Input() amountOfClassrooms?: number;

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
