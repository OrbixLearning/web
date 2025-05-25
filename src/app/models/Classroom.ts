import { Institution } from './Institution';
import { Syllabus } from './Syllabus';
import { UserAccount } from './User';
import { Document } from './Document';

export type Classroom = {
	id: string;
	name: string;
	institution: Institution;
	icon: string;
	syllabus: Syllabus[];
	documents: Document[];

	students?: UserAccount[];
	teachers?: UserAccount[];
};
