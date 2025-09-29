import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AddMemberToClassroomPopUpComponent } from '../../../../components/pop-ups/add-member-to-classroom-pop-up/add-member-to-classroom-pop-up.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { User, UserAccount } from '../../../../models/User';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';
import { UserService } from '../../../../services/user.service';

@Component({
	selector: 'o-classroom-members',
	imports: [
		TableModule,
		MatIconModule,
		MatButtonModule,
		RouterModule,
		LoadingComponent,
		AvatarComponent,
		SubHeaderComponent,
	],
	templateUrl: './classroom-members.component.html',
	styleUrl: './classroom-members.component.scss',
})
export class ClassroomMembersComponent {
	ctx: ContextService = inject(ContextService);
	classroomService: ClassroomService = inject(ClassroomService);
	userService: UserService = inject(UserService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	students: UserAccount[] = [];
	teachers: UserAccount[] = [];

	get tableStyle() {
		return {};
	}

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		if (this.ctx.isTeacher) {
			buttons.push({
				text: 'Adicionar pessoas',
				function: () => this.addMember(),
				icon: 'person_add',
				highlighted: true,
			});
		}
		return buttons;
	}

	ngOnInit() {
		this.getData();
	}

	getProfilePictureUrl(user: User): string {
		return this.userService.getProfilePictureUrl(user);
	}

	async getData() {
		this.isLoading = true;
		await Promise.all([
			lastValueFrom(this.userService.getClassroomStudents(this.ctx.classroom!.id)),
			lastValueFrom(this.userService.getClassroomTeachers(this.ctx.classroom!.id)),
		])
			.then(([students, teachers]) => {
				this.students = students;
				this.teachers = teachers;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	addMember() {
		this.dialog
			.open(AddMemberToClassroomPopUpComponent)
			.afterClosed()
			.subscribe(r => {
				if (r) {
					this.getData();
				}
			});
	}

	removeMember(user: UserAccount) {
		let data: ConfirmPopUpData = {
			title: `Tem certeza que deseja remover ${user.user.name} da turma?`,
			message: `Você poderá adicionar ${user.user.name} novamente a turma depois, mas seu progresso será perdido.`,
			confirmButton: 'Remover',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async r => {
				if (r) {
					this.isLoading = true;
					await lastValueFrom(this.classroomService.removeMember(this.ctx.classroom!.id, user.id))
						.then(() => {
							this.getData();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
