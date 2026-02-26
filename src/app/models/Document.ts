import { DocumentAIUploadStatusEnum } from '../enums/DocumentAIUploadStatus.enum';
import { DocumentTypeEnum } from '../enums/DocumentType.enum';
import { Classroom } from './Classroom';
import { QuestionData } from './QuestionData';
import { Syllabus } from './Syllabus';

export type Document = {
	id: string;
	name: string;
	extension: string;
	aiStatus: DocumentAIUploadStatusEnum;
	hidden: boolean;
	type: DocumentTypeEnum;
	syllabus?: Syllabus[];
	classroom?: Classroom[];
	questions?: QuestionData[];
	questionsValidated: boolean | null;
};
