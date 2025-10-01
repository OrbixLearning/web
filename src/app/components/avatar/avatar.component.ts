import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ContextService } from '../../services/context.service';

@Component({
	selector: 'o-avatar',
	imports: [MatButtonModule],
	templateUrl: './avatar.component.html',
	styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
	@Input() src!: string;
	@Input() id!: string;
	@Input() size: number = 42;
	@Input() clickable: boolean = true;
	@Output() onclick: EventEmitter<void> = new EventEmitter<void>();

	router: Router = inject(Router);
	ctx: ContextService = inject(ContextService);

	goToProfile() {
		this.ctx.clearClassroom();
		this.router.navigate(['/profile/' + this.id]);
	}
}
