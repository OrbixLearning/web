import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { lastValueFrom } from 'rxjs';
import { Institution } from '../../models/Institution';
import { ContextService } from '../../services/context.service';
import { InstitutionService } from '../../services/institution.service';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';

@Component({
	selector: 'o-header',
	imports: [MatIconModule, MatButtonModule, SelectModule, FormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	ctx: ContextService = inject(ContextService);
	route: ActivatedRoute = inject(ActivatedRoute);
	router: Router = inject(Router);

	@Output() sidebar: EventEmitter<void> = new EventEmitter<void>();

	institutionId?: string;

	constructor() {
		const urlSegments = this.router.url.split('/');
		this.institutionId = urlSegments.length > 2 ? urlSegments[2] : undefined;
	}

	ngOnInit() {
		this.setInstitution();
	}

	setInstitution() {
		this.ctx.institution = this.institutions.find(i => i.id === this.institutionId) || this.institutions[0];
	}

	get institutions(): Institution[] {
		let arr: Institution[] = [{ name: 'Pessoal' }];
		arr.push(...this.ctx.institutionList);
		return arr;
	}

	get logo(): string {
		return this.ctx.institution?.logo || 'assets/placeholder/logo.png';
	}

	get canConfigureInstitution(): boolean {
		if (!this.ctx.institution?.id) {
			return true;
		}
		return (
			this.ctx.institutionRole === InstitutionRoleEnum.ADMIN ||
			this.ctx.institutionRole === InstitutionRoleEnum.CREATOR
		);
	}

	changeInstitution(institution: Institution) {
		this.ctx.institution = institution;
		if (institution.id) {
			this.router.navigate(['/i/' + institution.id]);
		} else {
			this.router.navigate(['/']);
		}
	}

	onNotifications() {}
	onSettings() {}
	onProfile() {}
}
