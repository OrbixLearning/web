import { Classroom } from './Classroom';

export type Syllabus = {
	id: string | null; // null if creating a new syllabus
	name: string;
	description: string;
	topics: Syllabus[];
	documents: Document[];

	classroom: Classroom | null;
};
