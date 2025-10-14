import { Pipe, PipeTransform } from '@angular/core';
import { LearningPathTypeEnum } from '../enums/LearningPathType.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'learningPathType',
})
export class LearningPathTypePipe implements PipeTransform {
	transform(value: LearningPathTypeEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<LearningPathTypeEnum, string> = {
			[LearningPathTypeEnum.TEXT]: 'Texto',
			[LearningPathTypeEnum.VIDEO]: 'Vídeo',
			[LearningPathTypeEnum.AUDIO]: 'Áudio',
			[LearningPathTypeEnum.FLASHCARD]: 'Flash Card',
			[LearningPathTypeEnum.QUESTION]: 'Questão',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
