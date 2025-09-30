import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TextButtonComponent } from '../../components/buttons/text-button/text-button.component';

@Component({
	selector: 'o-error',
	imports: [MatIconModule, TextButtonComponent],
	templateUrl: './error.component.html',
	styleUrl: './error.component.scss',
})
export class ErrorComponent {
	router: Router = inject(Router);

	goBack() {
		window.history.back();
	}

	goHome() {
		this.router.navigate(['/']);
	}

	openReport() {
		this.router.navigate(['/report']);
	}

	reload() {
		window.location.reload();
	}
}
