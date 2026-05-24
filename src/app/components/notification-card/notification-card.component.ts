import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NotificationTypeEnum } from '../../enums/NotificationType.enum';
import { Notification } from '../../models/Notification';
import { NotificationService } from '../../services/notification.service';
import { DateUtils } from '../../utils/Date.util';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownComponent } from '../markdown/markdown.component';

@Component({
	selector: 'o-notification-card',
	imports: [MatButtonModule, MatIconModule, MarkdownComponent],
	templateUrl: './notification-card.component.html',
	styleUrl: './notification-card.component.scss',
})
export class NotificationCardComponent {
	service: NotificationService = inject(NotificationService);
	router: Router = inject(Router);

	@Input() notification!: Notification;
	@Output() remove = new EventEmitter<Notification>();
	@Output() closePopover = new EventEmitter<void>();

	readNotification() {
		if (!this.notification.read) {
			this.notification.read = true;
			lastValueFrom(this.service.read(this.notification.id));
		}
	}

	formatDate(date: Date): string {
		return DateUtils.format(date, 'DD/MM/YYYY HH:mm');
	}

	action() {
		switch (this.notification.type) {
			case NotificationTypeEnum.LEARNING_PATH_VALIDATION_REQUEST:
				this.goToLink();
				break;
			case NotificationTypeEnum.AI_SENTENCE_VALIDATION_REQUEST:
				this.goToLink();
				break;
			case NotificationTypeEnum.SYSTEM_ANNOUNCEMENT:
				this.goToLink();
				break;
		}
	}

	goToLink() {
		const link = this.notification.link;
		if (link && link.length > 0) {
			if (link.startsWith('http')) {
				window.open(link, '_blank');
				this.closePopover.emit();
			} else {
				this.router.navigate([link]).then(() => {
					this.closePopover.emit();
				});
			}
		}
	}
}
