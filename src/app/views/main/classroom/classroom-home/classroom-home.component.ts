import { Component, inject } from '@angular/core';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-classroom-home',
	imports: [],
	templateUrl: './classroom-home.component.html',
	styleUrl: './classroom-home.component.scss',
})
export class ClassroomHomeComponent {
	ctx: ContextService = inject(ContextService);
}
