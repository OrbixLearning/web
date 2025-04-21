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

	goToHome() {}

	goToClassroom(classroom: Classroom) {
		this.ctx.classroom = classroom;
	}
}
