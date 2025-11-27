import { Pipe, PipeTransform } from '@angular/core';
import { LMSEnum } from '../enums/LMS.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'lms',
})
export class LmsPipe implements PipeTransform {
	transform(value: LMSEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<LMSEnum, string> = {
			[LMSEnum.CANVAS]: 'Canvas',
			[LMSEnum.MOODLE]: 'Moodle',
			[LMSEnum.BLACKBOARD]: 'Blackboard',
		};

		const label = map[value] ?? String(value);
		return enumTransform(label, format);
	}
}
