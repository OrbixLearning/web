import { Pipe, PipeTransform } from '@angular/core';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'institutionRole',
})
export class InstitutionRolePipe implements PipeTransform {
	transform(value: InstitutionRoleEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<InstitutionRoleEnum, string> = {
			[InstitutionRoleEnum.STUDENT]: 'Estudante',
			[InstitutionRoleEnum.TEACHER]: 'Professor',
			[InstitutionRoleEnum.ADMIN]: 'Administrador',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
