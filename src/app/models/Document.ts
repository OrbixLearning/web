import { Classroom } from './Classroom';
import { Syllabus } from './Syllabus';

export type Document = {
	id: string;
	name: string;
	extension: string;
	syllabus: Syllabus[];
	classroom: Classroom[];
};
