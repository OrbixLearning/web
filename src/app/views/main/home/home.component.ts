import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ContextService } from '../../../services/context.service';
import { InstitutionService } from '../../../services/institution.service';

@Component({
	selector: 'o-home',
	imports: [MatButtonModule, RouterModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	ctx: ContextService = inject(ContextService);
	institutionService: InstitutionService = inject(InstitutionService);
	router: Router = inject(Router);

	getLogo(id: string): string {
		return this.institutionService.getLogoUrl(id);
	}

	changeInstitution(institutionId: string | null) {
		this.ctx.institution = this.ctx.institutionList!.find(i => i.id === institutionId)!;
		this.router.navigateByUrl('/i/' + institutionId);
	}

	goToGlobalSettings() {
        this.router.navigate(['/settings']);
    }
}
