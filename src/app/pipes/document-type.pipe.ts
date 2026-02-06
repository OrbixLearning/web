import { Pipe, PipeTransform } from '@angular/core';
import { DocumentTypeEnum } from '../enums/DocumentType.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'documentType',
})
export class DocumentTypePipe implements PipeTransform {
	transform(value: DocumentTypeEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<DocumentTypeEnum, string> = {
			[DocumentTypeEnum.OTHER]: 'Outro',
			[DocumentTypeEnum.HANDOUT]: 'Apostila',
			[DocumentTypeEnum.SLIDE]: 'Slide',
			[DocumentTypeEnum.EXERCISE]: 'Exercício',
			[DocumentTypeEnum.PAST_EXAM]: 'Prova Antiga',
			[DocumentTypeEnum.PAPER]: 'Artigo',
			[DocumentTypeEnum.LECTURE]: 'Aula',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
