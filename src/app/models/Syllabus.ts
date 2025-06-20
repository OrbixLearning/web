import { Classroom } from './Classroom';

export type Syllabus = {
	id: string | null; // null if creating a new syllabus
	name: string;
	topics: Syllabus[] | null;
	documents: Document[];

	classroom: Classroom | null;
};
