import { Classroom } from './Classroom';
import { User, UserAccount } from './User';

export type Institution = {
	id: string | null; // The personal institution does not have an id
	name: string;
	style: InstitutionStyle | null; // The personal institution does not have a style

	accounts?: UserAccount[];
	classrooms?: Classroom[];
	creator?: User;
};

export type InstitutionStyle = {
	primaryColor: string;
	secondaryColor: string;
	backgroundColor: string;
	textColor: string;
	theme: string;
};
