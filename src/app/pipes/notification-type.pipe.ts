import { Pipe, PipeTransform } from '@angular/core';
import { NotificationTypeEnum } from '../enums/NotificationType.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'notificationType',
})
export class NotificationTypePipe implements PipeTransform {
	transform(value: NotificationTypeEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<NotificationTypeEnum, string> = {
			[NotificationTypeEnum.LEARNING_PATH_VALIDATION_REQUEST]: 'Validação de rota de aprendizagem',
			[NotificationTypeEnum.LEARNING_PATH_VALIDATION_RESPONSE]: 'Resposta de validação de rota de aprendizagem',
			[NotificationTypeEnum.AI_SENTENCE_VALIDATION_REQUEST]: 'Validação de frase gerada por IA',
			[NotificationTypeEnum.AI_SENTENCE_VALIDATION_RESPONSE]: 'Resposta de validação de frase gerada por IA',
		};

		let label = map[value] ?? String(value);

		return enumTransform(label, format);
	}
}
