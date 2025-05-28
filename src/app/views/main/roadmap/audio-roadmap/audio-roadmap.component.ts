import { Component, inject, Input } from '@angular/core';
import { AudioRoadmap } from '../../../../models/Roadmap';
import { RoadmapService } from '../../../../services/roadmap.service';

@Component({
	selector: 'o-audio-roadmap',
	imports: [],
	templateUrl: './audio-roadmap.component.html',
	styleUrl: './audio-roadmap.component.scss',
})
export class AudioRoadmapComponent {
	@Input() roadmap!: AudioRoadmap;

	service: RoadmapService = inject(RoadmapService);

	get audioUrl(): string {
		return this.service.getAudioUrl(this.roadmap.id);
	}
}
