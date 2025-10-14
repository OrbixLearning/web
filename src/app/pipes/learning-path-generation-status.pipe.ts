import { Pipe, PipeTransform } from '@angular/core';
import { LearningPathGenerationStatusEnum } from '../enums/LearningPathGenerationStatus.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'learningPathGenerationStatus',
})
export class LearningPathGenerationStatusPipe implements PipeTransform {
	transform(
		value: LearningPathGenerationStatusEnum,
		format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase',
	): string {
		const map: Record<LearningPathGenerationStatusEnum, string> = {
			[LearningPathGenerationStatusEnum.GENERATING]: 'Gerando',
			[LearningPathGenerationStatusEnum.GENERATED]: 'Gerado',
			[LearningPathGenerationStatusEnum.FAILED]: 'Falha na geração',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
