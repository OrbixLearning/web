import { DocumentAIUploadStatusEnum } from '../enums/DocumentAIUploadStatus.enum';
import { Classroom } from './Classroom';
import { Syllabus } from './Syllabus';

export type Document = {
	id: string;
	name: string;
	extension: string;
	aiStatus: DocumentAIUploadStatusEnum;
	hidden: boolean;
	syllabus?: Syllabus[];
	classroom?: Classroom[];
};
