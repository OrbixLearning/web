import { Document } from './Document';
import { Institution } from './Institution';
import { QuestionData } from './QuestionData';
import { Syllabus } from './Syllabus';

export type Classroom = {
	id: string;
	name: string;
	institution: Institution;
	icon: string;
	syllabus: Syllabus[];
	documents: Document[];
	questions: QuestionData[];
	presets: SyllabusPreset[];

	numberOfStudents?: number;
	numberOfTeachers?: number;
};

export type SyllabusPreset = {
	name: string;
	syllabusIds: string[];
};
