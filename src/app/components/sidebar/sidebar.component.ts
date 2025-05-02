import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { Classroom } from '../../models/Classroom';
import { ClassroomService } from '../../services/classroom.service';
import { ContextService } from '../../services/context.service';
import { SidebarButtonComponent } from './sidebar-button/sidebar-button.component';

@Component({
	selector: 'o-sidebar',
	imports: [MatIconModule, MatButtonModule, RouterModule, DividerModule, SidebarButtonComponent],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
	router: Router = inject(Router);
	ctx: ContextService = inject(ContextService);
	service: ClassroomService = inject(ClassroomService);

	classroomId?: string;

	constructor() {
		const urlSegments = this.router.url.split('/');
		this.classroomId = urlSegments.length > 4 ? urlSegments[4] : undefined;
	}

	ngOnInit() {
		this.setClassroom();
	}

	setClassroom() {
		this.ctx.classroom = this.ctx.classroomList?.find(c => c.id === this.classroomId) || undefined;
	}

	get sortedClassrooms(): Classroom[] {
		if (!this.ctx.classroomList) return [];
		return this.ctx.classroomList.sort((a, b) => a.name.localeCompare(b.name));
	}

	isSelected(classroom: Classroom | null): boolean {
		if (!this.ctx.classroom) {
			return classroom === null;
		}
		return this.ctx.classroom.id === classroom?.id;
	}

	goToHome() {
		this.ctx.clearClassroom();
		this.router.navigate(['/i/' + this.ctx.institution?.id]);
	}

	goToClassroom(classroom: Classroom) {
		this.ctx.classroom = classroom;
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/c/', classroom.id]);
	}
}
