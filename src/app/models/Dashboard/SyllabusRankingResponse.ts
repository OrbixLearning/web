import { UserAccount } from '../User';

export type SyllabusRanking = {
	student: UserAccount;
	value: number;
	comment: string;
	update: Date;
};
