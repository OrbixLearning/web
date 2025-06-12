import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { QuestionTypeEnum } from '../enums/QuestionType.enum';
import { LearningPathTypeEnum } from '../enums/LearningPathType.enum';
import { Classroom } from './Classroom';
import { Syllabus } from './Syllabus';
import { User } from './User';

export type LearningPath =
	| VideoLearningPath
	| TextLearningPath
	| QuestionLearningPath
	| FlashCardLearningPath
	| AudioLearningPath;

type LearningPathBase = {
	id: string;
	name: string;
	icon: string;
	shared: boolean;
	validated: boolean;
	syllabus: Syllabus[];
	creator: User;
	classroom: Classroom;
	userInstitutionRole: InstitutionRoleEnum;
	type: LearningPathTypeEnum;
};

export type VideoLearningPath = {
	videos: VideoDetails[];
} & LearningPathBase;

export type TextLearningPath = {
	text: string;
} & LearningPathBase;

export type FlashCardLearningPath = {
	flashCards: FlashCard[];
} & LearningPathBase;

export type QuestionLearningPath = {
	questions: Question[];
} & LearningPathBase;

export type AudioLearningPath = {
	numberOfAudios: number;
} & LearningPathBase;

export type FlashCard = {
	front: string;
	back: string;
};

export type Question = {
	statement: string;
	options: string[];
	answers: string[];
	type: QuestionTypeEnum;
};

export type VideoDetails = {
	name: string;
	description: string;
	author: string;
	videoId: string;
};
