import { ReportTypeEnum } from '../enums/ReportType.enum';
import { User } from './User';

export type Report = {
	id: string;
	title: string;
	description: string;
	type: ReportTypeEnum;
	creator: User;
	createdAt: Date;
};
