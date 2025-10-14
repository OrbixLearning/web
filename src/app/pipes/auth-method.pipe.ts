import { Pipe, PipeTransform } from '@angular/core';
import { AuthMethodEnum } from '../enums/AuthMethod.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'authMethod',
})
export class AuthMethodPipe implements PipeTransform {
	transform(value: AuthMethodEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<AuthMethodEnum, string> = {
			[AuthMethodEnum.EMAIL]: 'Email',
			[AuthMethodEnum.GOOGLE]: 'Google',
		};

		let label = map[value] ?? String(value);

		return enumTransform(label, format);
	}
}
