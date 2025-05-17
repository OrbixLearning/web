import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AddMemberToClassroomPopUpComponent } from '../../../../components/pop-ups/add-member-to-classroom-pop-up/add-member-to-classroom-pop-up.component';
import { UserAccount } from '../../../../models/User';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';
import { UserService } from '../../../../services/user.service';

@Component({
	selector: 'o-classroom-members',
	imports: [TableModule, MatIconModule, MatButtonModule, RouterModule, LoadingComponent],
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

	ngOnInit() {
		this.getData();
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
}
