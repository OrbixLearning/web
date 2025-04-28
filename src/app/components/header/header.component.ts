import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { ContextService } from '../../services/context.service';

@Component({
	selector: 'o-header',
	imports: [MatIconModule, MatButtonModule, SelectModule, FormsModule, RouterModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	ctx: ContextService = inject(ContextService);
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
		const institutionList = this.ctx.institutionList;
		let arr: Institution[] = [{ id: null, name: 'Pessoal', logo: null, primaryColor: null, secondaryColor: null }];
		arr.push(...(this.ctx.institutionList || []));
		return arr;
	}

	get logo(): string {
		return this.ctx.institution?.logo || 'assets/placeholder/logo.png';
	}

	get homeUrl(): string {
		if (this.ctx.institution?.id) {
			return '/i/' + this.ctx.institution.id;
		} else {
			return '/';
		}
	}

	get canConfigureInstitution(): boolean {
		if (!this.ctx.institution?.id) {
			return false;
		}
		return (
			this.ctx.institutionRoles!.includes(InstitutionRoleEnum.ADMIN) ||
			this.ctx.institutionRoles!.includes(InstitutionRoleEnum.CREATOR)
		);
	}

	get settingsUrl(): string {
		if (this.ctx.institution?.id) {
			return '/i/' + this.ctx.institution.id + '/settings';
		} else {
			return '/settings';
		}
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
}
