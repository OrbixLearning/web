import { Pipe, PipeTransform } from '@angular/core';
import { RoleEnum } from '../enums/Role.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'role',
})
export class RolePipe implements PipeTransform {
	transform(value: RoleEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<RoleEnum, string> = {
			[RoleEnum.ADMIN]: 'Administrador',
			[RoleEnum.USER]: 'Usuário',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
