import { Component, inject, Input } from '@angular/core';
import { AudioLearningPath } from '../../../../models/LearningPath/LearningPath';
import { AudioLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { LearningPathService } from '../../../../services/learning-path.service';
import { ChatComponent } from '../../../../components/chat/chat.component';

@Component({
	selector: 'o-audio-learning-path',
	imports: [ChatComponent],
	templateUrl: './audio-learning-path.component.html',
	styleUrl: './audio-learning-path.component.scss',
})
export class AudioLearningPathComponent {
	@Input() learningPathStudy!: AudioLearningPathStudy;
	@Input() mode: 'view' | 'study' = 'view';

	service: LearningPathService = inject(LearningPathService);

	numberOfAudios: number = 0;
	iterableAudios: number[] = [];

	ngOnInit() {
		this.numberOfAudios = (this.learningPathStudy.learningPath as AudioLearningPath).numberOfAudios!;
		this.iterableAudios = Array.from({ length: this.numberOfAudios }, (_, i) => i);
	}

	getAudioUrl(number: number): string {
		return this.service.getAudioUrl(this.learningPathStudy.learningPath.id, number);
	}
}
