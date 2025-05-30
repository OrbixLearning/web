import { Component, inject, Input } from '@angular/core';
import { AudioRoadmapStudy } from '../../../../models/RoadmapStudy';
import { RoadmapService } from '../../../../services/roadmap.service';

@Component({
	selector: 'o-audio-roadmap',
	imports: [],
	templateUrl: './audio-roadmap.component.html',
	styleUrl: './audio-roadmap.component.scss',
})
export class AudioRoadmapComponent {
	@Input() roadmapStudy!: AudioRoadmapStudy;

	service: RoadmapService = inject(RoadmapService);

	get audioUrl(): string {
		return this.service.getAudioUrl(this.roadmapStudy.roadmap.id);
	}
}
