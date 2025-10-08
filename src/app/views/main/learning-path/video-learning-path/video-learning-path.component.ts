import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { VideoLearningPath } from '../../../../models/LearningPath/LearningPath';
import { VideoLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { VideoDetails } from '../../../../models/LearningPath/VideoDetails';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { LearningPathService } from '../../../../services/learning-path.service';
import { EditVideoPopUpComponent } from './edit-video-pop-up/edit-video-pop-up.component';

@Component({
	selector: 'o-video-learning-path',
	imports: [SafeUrlPipe, HighlightButtonComponent, LoadingComponent, TextButtonComponent],
	templateUrl: './video-learning-path.component.html',
	styleUrl: './video-learning-path.component.scss',
})
export class VideoLearningPathComponent {
	dialog: MatDialog = inject(MatDialog);
	service: LearningPathService = inject(LearningPathService);

	@Input() learningPathStudy!: VideoLearningPathStudy;
	@Input() mode: 'edit' | 'study' = 'edit';

	videos: VideoDetails[] = [];
	showVideoIDInfo: boolean = false;
	isLoading: boolean = false;

	ngOnInit() {
		this.videos = (this.learningPathStudy.learningPath as VideoLearningPath).videos!;
	}

	getUrl(videoId: string): string {
		return `https://www.youtube.com/embed/${videoId}`;
	}

	isValidVideoId(id?: string | null): boolean {
		return !!id && /^[A-Za-z0-9_-]{11}$/.test(id);
	}

	addVideo() {
		this.dialog
			.open(EditVideoPopUpComponent, {
				minWidth: '800px',
			})
			.afterClosed()
			.subscribe((result: { video: VideoDetails; index: number } | undefined) => {
				if (result) {
					if (result.index >= 0 && result.index < this.videos.length) {
						this.videos.splice(result.index, 0, result.video);
					} else {
						this.videos.push(result.video);
					}
				}
			});
	}

	editVideo(video: VideoDetails, index: number) {
		this.dialog
			.open(EditVideoPopUpComponent, {
				data: { video, index },
				minWidth: '800px',
			})
			.afterClosed()
			.subscribe((result: { video: VideoDetails; index: number } | undefined) => {
				if (result) {
					if (result.index !== index) {
						this.videos.splice(index, 1);
						if (result.index >= 0 && result.index < this.videos.length) {
							this.videos.splice(result.index, 0, result.video);
						} else {
							this.videos.push(result.video);
						}
					} else {
						this.videos[index] = result.video;
					}
				}
			});
	}

	deleteVideo(video: VideoDetails, index: number) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir o vídeo ${video.name}?`,
			message: 'Esta ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async result => {
				if (result) {
					this.videos.splice(index, 1);
				}
			});
	}

	async save() {
		this.isLoading = true;
		await lastValueFrom(this.service.editVideoLearningPath(this.learningPathStudy.learningPath.id, this.videos))
			.then((learningPath: VideoLearningPath) => {
				this.learningPathStudy.learningPath = learningPath;
				this.videos = learningPath.videos!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
