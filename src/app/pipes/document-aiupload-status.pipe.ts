import { Pipe, PipeTransform } from '@angular/core';
import { DocumentAIUploadStatusEnum } from '../enums/DocumentAIUploadStatus.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'documentAIUploadStatus',
})
export class DocumentAIUploadStatusPipe implements PipeTransform {
	transform(
		value: DocumentAIUploadStatusEnum,
		format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase',
	): string {
		const map: Record<DocumentAIUploadStatusEnum, string> = {
			[DocumentAIUploadStatusEnum.UPLOADING]: 'Enviando',
			[DocumentAIUploadStatusEnum.UPLOADED]: 'Enviado',
			[DocumentAIUploadStatusEnum.NOT_UPLOADED]: 'Não enviado',
			[DocumentAIUploadStatusEnum.FAILED]: 'Falha no envio',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
