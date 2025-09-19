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
	students?: UserAccount[];
	teachers?: UserAccount[];
	
    updatedAt?: string | Date; 
};

export type SyllabusPreset = {
	name: string;
	syllabusIds: string[];
};
