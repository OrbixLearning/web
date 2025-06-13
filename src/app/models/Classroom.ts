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
	presets: SyllabusPreset[];
	hasSyllabusDocument: boolean;

	students?: UserAccount[];
	teachers?: UserAccount[];
};

export type SyllabusPreset = {
	name: string;
	syllabusIds: string[];
};
