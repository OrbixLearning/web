import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../../components/sub-header/sub-header.component';
import { ClassroomCurrentScore } from '../../../../../models/Dashboard/ClassroomCurrentScore';
import { Syllabus } from '../../../../../models/Syllabus';
import { User, UserAccount } from '../../../../../models/User';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { UserService } from '../../../../../services/user.service';
import { TreeUtils } from '../../../../../utils/Tree.utils';
import { AvatarComponent } from "../../../../../components/avatar/avatar.component";

@Component({
	selector: 'o-home-dashboard',
	imports: [LoadingComponent, MatButtonModule, MatIconModule, RouterModule, ProgressBarModule, SubHeaderComponent, AvatarComponent],
	templateUrl: './home-dashboard.component.html',
	styleUrl: './home-dashboard.component.scss',
})
export class HomeDashboardComponent {
	ctx: ContextService = inject(ContextService);
	service: DashboardService = inject(DashboardService);
	userService: UserService = inject(UserService);
	dialog: MatDialog = inject(MatDialog);

	isLoading = false;
	students: UserAccount[] = [];
	classroomCurrentScores: ClassroomCurrentScore[] = [];
	flatSyllabus: Syllabus[] = TreeUtils.flattenTree(this.ctx.classroom?.syllabus || [], 'topics');

	get classroomBaseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		buttons.push({
			text: 'Forçar atualização de notas',
			icon: 'refresh',
			function: () => this.forceUpdateScores(),
			highlighted: true,
		});
		return buttons;
	}

	ngOnInit() {
		this.getData();
	}

	async getData() {
		this.isLoading = true;
		Promise.all([
			lastValueFrom(this.userService.getClassroomStudents(this.ctx.classroom?.id!)),
			lastValueFrom(this.service.getClassroomCurrentScores(this.ctx.classroom?.id!)),
		])
			.then(([students, classroomCurrentScores]) => {
				this.students = students;
				this.classroomCurrentScores = classroomCurrentScores;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	getProfilePictureUrl(user: User): string {
		return this.userService.getProfilePictureUrl(user);
	}

	getSyllabusScore(syllabusId: string): ClassroomCurrentScore | undefined {
		return this.classroomCurrentScores.find(score => score.syllabus.id === syllabusId);
	}

	forceUpdateScores() {
		const data: ConfirmPopUpData = {
			title: 'Essa ação pode demorar alguns minutos!',
			message: 'Você tem certeza que deseja forçar a atualização das notas?',
			confirmButton: 'Sim, forçar atualização',
		};
		this.dialog
			.open(ConfirmPopUpComponent, {
				data,
			})
			.afterClosed()
			.subscribe(async confirmed => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.forceClassroomScoresUpdate(this.ctx.classroom?.id!))
						.then(async () => {
							await this.getData();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
