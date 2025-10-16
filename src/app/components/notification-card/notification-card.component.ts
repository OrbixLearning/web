import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NotificationTypeEnum } from '../../enums/NotificationType.enum';
import { Notification } from '../../models/Notification';
import { NotificationService } from '../../services/notification.service';
import { DateUtils } from '../../utils/Date.util';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-notification-card',
	imports: [MatButtonModule, MatIconModule],
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
		}
	}

	goToLink() {
		this.router.navigate([this.notification.link!]).then(() => {
			this.closePopover.emit();
		});
	}
}
