import { Pipe, PipeTransform } from '@angular/core';
import { enumTransform } from '../utils/Enum.utils';
import { QuestionTypeEnum } from '../enums/QuestionType.enum';

@Pipe({
	name: 'questionType',
})
export class QuestionTypePipe implements PipeTransform {
	transform(value: QuestionTypeEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<QuestionTypeEnum, string> = {
			[QuestionTypeEnum.MULTIPLE_CHOICE]: 'Múltipla escolha',
			[QuestionTypeEnum.MULTIPLE_SELECTION]: 'Múltipla seleção',
			[QuestionTypeEnum.TRUE_FALSE]: 'Verdadeiro ou falso',
			[QuestionTypeEnum.OPEN_ENDED]: 'Aberta',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
