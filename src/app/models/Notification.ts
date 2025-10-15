import { NotificationTypeEnum } from '../enums/NotificationType.enum';
import { User } from './User';

export type Notification = {
	id: string;
	title: string;
	message: string;
	date: Date;
	link?: string;
	type: NotificationTypeEnum;
	read: boolean;
	sender: User;
	receiver: User;
};
