import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { Institution } from '../../models/Institution';
import { ContextService } from '../../services/context.service';
import { ThemeService } from '../../services/theme.service';
import { InstitutionService } from '../../services/institution.service';

@Component({
	selector: 'o-header',
	imports: [MatIconModule, MatButtonModule, SelectModule, FormsModule, RouterModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	theme: ThemeService = inject(ThemeService);
	institutionService: InstitutionService = inject(InstitutionService);

	@Output() sidebar: EventEmitter<void> = new EventEmitter<void>();

	institutionId?: string;
	personalInstitution: Institution = {
		id: null,
		name: 'Pessoal',
		primaryColor: null,
		secondaryColor: null,
	};
	selectedInstitution: Institution = this.personalInstitution;

	constructor() {
		const urlSegments = this.router.url.split('/');
		this.institutionId = urlSegments.length > 2 && urlSegments[1] === 'i' ? urlSegments[2] : undefined;
		if (this.institutionId) this.selectedInstitution = this.ctx.institution!;
	}

	ngOnInit() {
		this.setThemes();
	}

	get institutions(): Institution[] {
		const institutionList = this.ctx.institutionList;
		let arr: Institution[] = [this.personalInstitution];
		arr.push(...(this.ctx.institutionList || []));
		return arr;
	}

	get logo(): string {
		return this.ctx.institution?.id
			? this.institutionService.getLogoUrl(this.ctx.institution.id)
			: 'assets/logos/white-logo.png';
	}

	get canConfigureInstitution(): boolean {
		if (!this.ctx.institution?.id || !this.ctx.institutionRoles) {
			return false;
		}
		return (
			this.ctx.institutionRoles!.includes(InstitutionRoleEnum.ADMIN) ||
			this.ctx.institutionRoles!.includes(InstitutionRoleEnum.CREATOR)
		);
	}

	setThemes() {
		if (this.ctx.institution?.id) this.theme.setInstitutionTheme(this.ctx.institution);
		else this.theme.setBaseTheme();
	}

	changeInstitution(institution: Institution) {
		this.ctx.institution = institution;
		this.setThemes();
		if (institution.id) {
			this.router.navigate(['/i/' + institution.id]);
		} else {
			this.router.navigate(['/']);
		}
	}

	goToSettings() {
		this.ctx.clearClassroom();
		if (this.ctx.institution?.id) {
			this.router.navigate(['/i/' + this.ctx.institution.id + '/settings']);
		} else {
			this.router.navigate(['/settings']);
		}
	}

	goToHome() {
		this.ctx.clearClassroom();
		if (this.ctx.institution?.id) {
			this.router.navigate(['/i/' + this.ctx.institution.id]);
		} else {
			this.router.navigate(['/']);
		}
	}

	goToProfile() {
		this.ctx.clearClassroom();
		this.router.navigate(['/profile/' + this.ctx.user?.id]);
	}

	goToReport() {
		this.ctx.clearClassroom();
		this.router.navigate(['/report']);
	}
}
