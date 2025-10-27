import { Component, inject, Input } from '@angular/core';
import { AudioLearningPath } from '../../../../models/LearningPath/LearningPath';
import { ContextService } from '../../../../services/context.service';
import { LearningPathService } from '../../../../services/learning-path.service';

@Component({
	selector: 'o-audio-learning-path',
	imports: [],
	templateUrl: './audio-learning-path.component.html',
	styleUrl: './audio-learning-path.component.scss',
})
export class AudioLearningPathComponent {
	service: LearningPathService = inject(LearningPathService);
	ctx: ContextService = inject(ContextService);

	@Input() mode: 'edit' | 'study' = 'edit';

	numberOfAudios: number = 0;
	iterableAudios: number[] = [];

	ngOnInit() {
		this.startData();
	}

	startData() {
		this.numberOfAudios = (this.ctx.learningPathStudy!.learningPath as AudioLearningPath).numberOfAudios!;
		this.iterableAudios = Array.from({ length: this.numberOfAudios }, (_, i) => i);
	}

	getAudioUrl(number: number): string {
		return this.service.getAudioUrl(this.ctx.learningPathStudy!.learningPath.id, number);
	}

	async save() {}

	reset() {
		this.startData();
	}
}
