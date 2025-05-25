import { Classroom } from './Classroom';
import { User, UserAccount } from './User';

export type Institution = {
	id: string | null; // The personal institution does not have an id
	name: string;
	primaryColor: string | null;
	secondaryColor: string | null;

	accounts?: UserAccount[];
	classrooms?: Classroom[];
	creator?: User;
};
