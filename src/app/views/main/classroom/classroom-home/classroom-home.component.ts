import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { PopoverModule } from 'primeng/popover';
import { lastValueFrom } from 'rxjs';
import { ChatComponent } from '../../../../components/chat/chat.component';
import { LearningPathCardComponent } from '../../../../components/learning-path-card/learning-path-card.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { LearningPathCreationPopUpComponent } from '../../../../components/pop-ups/learning-path-creation-pop-up/learning-path-creation-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { InstitutionRoleEnum } from '../../../../enums/InstitutionRole.enum';
import { LearningPathGenerationStatusEnum } from '../../../../enums/LearningPathGenerationStatus.enum';
import { LearningPath } from '../../../../models/LearningPath/LearningPath';
import { Syllabus } from '../../../../models/Syllabus';
import { ContextService } from '../../../../services/context.service';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';

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
		SubHeaderComponent,
		TextButtonComponent,
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
	learningPathsInChat: LearningPath[] = [];

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

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		buttons.push({
			text: 'Criar rota de aprendizagem',
			icon: 'add',
			function: () => this.createLearningPath(),
			highlighted: true,
		});
		buttons.push({
			text: 'Documentos',
			icon: 'description',
			function: () => this.router.navigateByUrl(this.baseUrl + '/documents'),
			highlighted: true,
		});
		buttons.push({
			text: 'Membros',
			icon: 'groups',
			function: () => this.router.navigateByUrl(this.baseUrl + '/members'),
			highlighted: true,
		});
		if (this.ctx.isTeacher) {
			buttons.push({
				text: 'Dashboard',
				icon: 'insights',
				function: () => this.router.navigateByUrl(this.baseUrl + '/dashboard'),
				highlighted: true,
			});
			buttons.push({
				text: 'Configurações',
				icon: 'settings',
				function: () => this.router.navigateByUrl(this.baseUrl + '/settings'),
				highlighted: true,
			});
		}
		return buttons;
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
				width: '960px',
				maxWidth: '95vw',
				autoFocus: false,
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

	async shareLearningPath(learningPath: LearningPath) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja compartilhar a rota de aprendizagem "${learningPath.name}"?`,
			message: `Essa ação não pode ser desfeita. Uma vez compartilhada, qualquer membro da turma poderá acessar essa rota de aprendizagem.`,
			confirmButton: 'Compartilhar',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.learningPathService.shareLearningPath(learningPath.id))
						.then(() => {
							learningPath.shared = true;
							if (learningPath.id === this.ctx.learningPathStudy?.learningPath?.id) {
								this.ctx.learningPathStudy!.learningPath = learningPath;
							}
						})
						.finally(() => {
							this.isLoading = false;
						});
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

	isLearningPathIdInChat(learningPathId: string): boolean {
		return this.learningPathsInChat.map(lp => lp.id).includes(learningPathId);
	}

	addLearningPathToChat(learningPath: LearningPath) {
		this.learningPathsInChat.push(learningPath);
	}

	removeLearningPathFromChat(learningPath: LearningPath) {
		this.learningPathsInChat = this.learningPathsInChat.filter(
			learningPathInChat => learningPathInChat.id !== learningPath.id,
		);
	}
}
