import { Component, inject } from '@angular/core';
import { ContextService } from '../../../services/context.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { RoadmapService } from '../../../services/roadmap.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { lastValueFrom, share } from 'rxjs';
import {
	AudioRoadmap,
	FlashCardRoadmap,
	QuestionRoadmap,
	Roadmap,
	TextRoadmap,
	VideoRoadmap,
} from '../../../models/Roadmap';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { RoadmapTypeEnum } from '../../../enums/RoadmapType.enum';
import { AudioRoadmapComponent } from './audio-roadmap/audio-roadmap.component';
import { FlashCardRoadmapComponent } from './flash-card-roadmap/flash-card-roadmap.component';
import { QuestionRoadmapComponent } from './question-roadmap/question-roadmap.component';
import { TextRoadmapComponent } from './text-roadmap/text-roadmap.component';
import { VideoRoadmapComponent } from './video-roadmap/video-roadmap.component';

@Component({
	selector: 'o-roadmap',
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterModule,
		LoadingComponent,
		TooltipModule,
		ToggleSwitchModule,
		FormsModule,
		AudioRoadmapComponent,
		FlashCardRoadmapComponent,
		QuestionRoadmapComponent,
		TextRoadmapComponent,
		VideoRoadmapComponent,
	],
	templateUrl: './roadmap.component.html',
	styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent {
	ctx: ContextService = inject(ContextService);
	service: RoadmapService = inject(RoadmapService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);

	isLoading: boolean = false;
	mine: boolean = this.ctx.roadmap?.creator.id === this.ctx.user?.id;
	mode: 'view' | 'study' = this.mine || !this.ctx.isTeacher ? 'study' : 'view';
	typeEnum = RoadmapTypeEnum;

	get roadmapAsAudio(): AudioRoadmap {
		return this.ctx.roadmap as AudioRoadmap;
	}

	get roadmapAsFlashCard(): FlashCardRoadmap {
		return this.ctx.roadmap as FlashCardRoadmap;
	}

	get roadmapAsQuestion(): QuestionRoadmap {
		return this.ctx.roadmap as QuestionRoadmap;
	}

	get roadmapAsText(): TextRoadmap {
		return this.ctx.roadmap as TextRoadmap;
	}

	get roadmapAsVideo(): VideoRoadmap {
		return this.ctx.roadmap as VideoRoadmap;
	}

	toggleMode() {
		if (this.mode === 'view') {
			this.mode = 'study';
		} else {
			this.mode = 'view';
		}
	}

	async validateRoadmap() {
		this.isLoading = true;
		await lastValueFrom(this.service.validateRoadmap(this.ctx.roadmap!.id, true))
			.then((roadmap: Roadmap) => {
				this.ctx.roadmap = roadmap;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async updatedRoadmapSharing() {
		this.isLoading = true;
		await lastValueFrom(this.service.updateRoadmapSharing(this.ctx.roadmap!.id, this.ctx.roadmap!.shared)).finally(
			() => {
				this.isLoading = false;
			},
		);
	}

	async deleteRoadmap() {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir esta trilha?',
			message: 'Esta ação não poderá ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async result => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(this.service.delete(this.ctx.roadmap!.id))
						.then(() => {
							this.router.navigateByUrl(`/i/${this.ctx.institution?.id}/c/${this.ctx.classroom?.id}`);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
