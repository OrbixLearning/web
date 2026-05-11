import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-classroom-dashboard',
	imports: [RouterOutlet],
	templateUrl: './classroom-dashboard.component.html',
	styleUrl: './classroom-dashboard.component.scss',
})
export class ClassroomDashboardComponent {
	ctx: ContextService = inject(ContextService);

	ngOnInit() {
		this.ctx.closeSidebar();
	}

	ngOnDestroy() {
		this.ctx.openSidebar();
	}
}
