import { Pipe, PipeTransform } from '@angular/core';
import { ReportTypeEnum } from '../enums/ReportType.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'reportType',
})
export class ReportTypePipe implements PipeTransform {
	transform(value: ReportTypeEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<ReportTypeEnum, string> = {
			[ReportTypeEnum.PRAISE]: 'Elogio',
			[ReportTypeEnum.SUGGESTION]: 'Sugestão',
			[ReportTypeEnum.ERROR]: 'Erro',
			[ReportTypeEnum.SUPPORT]: 'Suporte',
			[ReportTypeEnum.OTHER]: 'Outro',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
