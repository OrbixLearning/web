import { Classroom } from './Classroom';

export type Syllabus = {
	id: string | null; // null if creating a new syllabus
	name: string;
	description: string | null;
	topics: Syllabus[] | null;
	documents: Document[];

	classroom: Classroom | null;
};
