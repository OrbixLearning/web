import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-classroom-dashboard',
	imports: [LoadingComponent, MatButtonModule, MatIconModule, RouterModule],
	templateUrl: './classroom-dashboard.component.html',
	styleUrl: './classroom-dashboard.component.scss',
})
export class ClassroomDashboardComponent {
	ctx: ContextService = inject(ContextService);

	isLoading = false;
}
