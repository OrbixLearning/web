import { Component, inject, Input } from '@angular/core';
import { AudioRoadmapStudy } from '../../../../models/RoadmapStudy';
import { RoadmapService } from '../../../../services/roadmap.service';
import { AudioRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-audio-roadmap',
	imports: [],
	templateUrl: './audio-roadmap.component.html',
	styleUrl: './audio-roadmap.component.scss',
})
export class AudioRoadmapComponent {
	@Input() roadmapStudy!: AudioRoadmapStudy;

	service: RoadmapService = inject(RoadmapService);

	numberOfAudios: number = 0;
	iterableAudios: number[] = [];

	ngOnInit() {
		this.numberOfAudios = (this.roadmapStudy.roadmap as AudioRoadmap).numberOfAudios;
		this.iterableAudios = Array.from({ length: this.numberOfAudios }, (_, i) => i);
	}

	getAudioUrl(number: number): string {
		return this.service.getAudioUrl(this.roadmapStudy.roadmap.id, number);
	}
}
