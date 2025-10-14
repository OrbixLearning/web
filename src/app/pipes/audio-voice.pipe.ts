import { Pipe, PipeTransform } from '@angular/core';
import { AudioVoiceEnum } from '../enums/AudioVoice.enum';

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

		switch (format) {
			case 'uppercase':
				label = label.toUpperCase();
				break;
			case 'lowercase':
				label = label.toLowerCase();
				break;
			case 'camelcase':
				label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
				break;
			case 'snakecase':
				label = label.replace(/\s+/g, '_').toLowerCase();
				break;
		}

		return label;
	}
}
