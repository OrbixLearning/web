import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'o-loading',
	imports: [MatProgressSpinnerModule],
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss',
})
export class LoadingComponent {
	@Input() isLoading!: boolean;
	@Input() text: string | undefined;
	@Input() local: boolean = false;
	@Input() size: string = '100%';
}
