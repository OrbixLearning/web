import { Pipe, PipeTransform } from '@angular/core';
import { AudioVoiceEnum } from '../enums/AudioVoice.enum';
import { enumTransform } from '../utils/Enum.utils';

@Pipe({
	name: 'audioVoice',
})
export class AudioVoicePipe implements PipeTransform {
	transform(value: AudioVoiceEnum, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
		const map: Record<AudioVoiceEnum, string> = {
			[AudioVoiceEnum.ALLOY]: 'Alloy',
			[AudioVoiceEnum.ECHO]: 'Echo',
			[AudioVoiceEnum.FABLE]: 'Fable',
			[AudioVoiceEnum.ONYX]: 'Onyx',
			[AudioVoiceEnum.NOVA]: 'Nova',
			[AudioVoiceEnum.SHIMMER]: 'Shimmer',
			[AudioVoiceEnum.SAGE]: 'Sage',
			[AudioVoiceEnum.CORAL]: 'Coral',
			[AudioVoiceEnum.ASH]: 'Ash',
		};

		let label = map[value] ?? String(value);

		return enumTransform(label, format);
	}
}
