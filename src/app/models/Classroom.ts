import { Institution } from './Institution';
import { Syllabus } from './Syllabus';
import { UserAccount } from './User';

export type Classroom = {
	id: string;
	name: string;
	institution: Institution;
	icon: string;
	syllabus: Syllabus[];

	students?: UserAccount[];
	teachers?: UserAccount[];
};
