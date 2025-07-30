import { User } from '../User';

export type SyllabusRanking = {
	student: User;
	value: number;
	comment: string;
	update: Date;
};
