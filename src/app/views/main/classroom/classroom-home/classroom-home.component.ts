import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { last, lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { LearningPathCreationPopUpComponent } from '../../../../components/pop-ups/learning-path-creation-pop-up/learning-path-creation-pop-up.component';
import { LearningPathCardComponent } from '../../../../components/learning-path-card/learning-path-card.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { InstitutionRoleEnum } from '../../../../enums/InstitutionRole.enum';
import { LearningPath } from '../../../../models/LearningPath/LearningPath';
import { Syllabus } from '../../../../models/Syllabus';
import { ContextService } from '../../../../services/context.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { LearningPathGenerationStatusEnum } from '../../../../enums/LearningPathGenerationStatus.enum';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { PopoverModule } from 'primeng/popover';
import { ChatComponent } from '../../../../components/chat/chat.component';

@Component({
	selector: 'o-classroom-home',
	imports: [
		MatIconModule,
		MatButtonModule,
		RouterModule,
		DividerModule,
		MatFormFieldModule,
		MatInputModule,
		SyllabusComponent,
		LearningPathCardComponent,
		FormsModule,
		LoadingComponent,
		PopoverModule,
		ChatComponent,
	],
	templateUrl: './classroom-home.component.html',
	styleUrl: './classroom-home.component.scss',
})
export class ClassroomHomeComponent {
	ctx: ContextService = inject(ContextService);
	learningPathService: LearningPathService = inject(LearningPathService);
	learningPathStudyService: LearningPathStudyService = inject(LearningPathStudyService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);
	route: ActivatedRoute = inject(ActivatedRoute);

	isLoading: boolean = true;
	myLearningPaths: LearningPath[] = [];
	sharedLearningPaths: LearningPath[] = [];
	filter: string = '';
	syllabusFilter: string[] = [];

	ngOnInit() {
		// This is used to update the data when the classroomId changes in the URL
		this.route.params.subscribe(params => {
			this.getData();
		});
	}

	get baseUrl(): string {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	// TODO: Study the best and more performant way to filter the learning paths (maybe backend filtering)
	get teacherLearningPaths(): LearningPath[] {
		return this.sharedLearningPaths.filter(learningPath => !this.studentLearningPaths.includes(learningPath));
	}

	get studentLearningPaths(): LearningPath[] {
		return this.sharedLearningPaths.filter(
			learningPath => learningPath.userInstitutionRole === InstitutionRoleEnum.STUDENT,
		);
	}

	get filteredMyLearningPaths(): LearningPath[] {
		return this.myLearningPaths.filter(this.filterLearningPath);
	}

	get filteredMyGeneratedLearningPaths(): LearningPath[] {
		return this.filteredMyLearningPaths.filter(
			learningPath => learningPath.generation.status === LearningPathGenerationStatusEnum.GENERATED,
		);
	}

	get filteredMyNotGeneratedLearningPaths(): LearningPath[] {
		return this.filteredMyLearningPaths.filter(
			learningPath => learningPath.generation.status !== LearningPathGenerationStatusEnum.GENERATED,
		);
	}

	get filteredStudentLearningPaths(): LearningPath[] {
		return this.studentLearningPaths.filter(this.filterLearningPath);
	}

	get filteredTeacherLearningPaths(): LearningPath[] {
		return this.teacherLearningPaths.filter(this.filterLearningPath);
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	filterLearningPath = (learningPath: LearningPath): boolean => {
		const filteredBySyllabus =
			this.syllabusFilter.length === 0 ||
			ArrayUtils.hasAllItems(
				learningPath.syllabus.map(r => r.id),
				this.syllabusFilter,
			);

		const filteredByName =
			learningPath.name.toLowerCase().includes(this.filter.toLowerCase()) ||
			learningPath.creator.name.toLowerCase().includes(this.filter.toLowerCase());

		return filteredBySyllabus && filteredByName;
	};

	resetData() {
		this.myLearningPaths = [];
		this.sharedLearningPaths = [];
	}

	async getData() {
		this.isLoading = true;
		this.resetData();
		Promise.all([
			lastValueFrom(this.learningPathService.getUserLearningPathsByClassroom(this.ctx.classroom?.id!)),
			lastValueFrom(this.learningPathService.getClassroomSharedLearningPaths(this.ctx.classroom?.id!)),
		])
			.then(res => {
				this.myLearningPaths = res[0];
				this.sharedLearningPaths = res[1];
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.syllabusFilter = syllabus.map(s => s.id!);
	}

	createLearningPath() {
		this.dialog
			.open(LearningPathCreationPopUpComponent, {
				disableClose: true,
				maxWidth: '1800px',
			})
			.afterClosed()
			.subscribe((res: LearningPath | undefined) => {
				if (res) {
					this.myLearningPaths = [res, ...this.myLearningPaths];
				}
			});
	}

	goToLearningPath(learningPath: LearningPath) {
		this.router.navigate(['/i', this.ctx.institution?.id, 'c', this.ctx.classroom?.id, 'lp', learningPath.id]);
	}

	async updatedLearningPathSharing(learningPath: LearningPath) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja ${
				learningPath.shared ? 'compartilhar a' : 'remover o compartilhamento da'
			} rota de aprendizagem "${learningPath.name}"?`,
			message: `Você poderá alterar essa configuração posteriormente.`,
			confirmButton: learningPath.shared ? 'Compartilhar' : 'Remover compartilhamento',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(
						this.learningPathService.updateLearningPathSharing(learningPath.id, learningPath.shared),
					)
						.then(() => {
							if (learningPath.id === this.ctx.learningPathStudy?.learningPath?.id) {
								this.ctx.learningPathStudy!.learningPath = learningPath;
							}
						})
						.finally(() => {
							this.isLoading = false;
						});
				} else {
					learningPath.shared = !learningPath.shared;
				}
			});
	}

	async regenerateLearningPath(learningPath: LearningPath) {
		this.isLoading = true;
		await lastValueFrom(this.learningPathService.regenerateLearningPath(learningPath.id))
			.then(async () => {
				await this.getData();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
