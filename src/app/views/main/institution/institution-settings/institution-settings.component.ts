import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { WhiteLabelConfigurationComponent } from '../../../../components/white-label-configuration/white-label-configuration.component';
import { LmsPipe } from '../../../../pipes/lms.pipe';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-institution-settings',
	imports: [HighlightButtonComponent, LmsPipe, WhiteLabelConfigurationComponent],
	templateUrl: './institution-settings.component.html',
	styleUrl: './institution-settings.component.scss',
})
export class InstitutionSettingsComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);

	goToUsers() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/users']);
	}

	goToClassrooms() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/classrooms']);
	}

	goToReport() {
		this.router.navigate(['/report']);
	}
}
