import { Institution } from './Institution';
import { UserAccount } from './User';

export type Classroom = {
	id: string;
	name: string;
	institution: Institution;
	icon: string | null;

	students?: UserAccount[];
	teachers?: UserAccount[];
};
