import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { QuestionTypeEnum } from '../enums/QuestionType.enum';
import { RoadmapTypeEnum } from '../enums/RoadmapType.enum';
import { Classroom } from './Classroom';
import { Syllabus } from './Syllabus';
import { User } from './User';

export type Roadmap = VideoRoadmap | TextRoadmap | QuestionRoadmap | FlashCardRoadmap | AudioRoadmap;

type RoadmapBase = {
	id: string;
	name: string;
	shared: boolean;
	validated: boolean;
	syllabus: Syllabus[];
	user: User;
	classroom: Classroom;
	userInstitutionRole: InstitutionRoleEnum;
	type: RoadmapTypeEnum;
};

export type VideoRoadmap = {
	videoLinks: string[];
} & RoadmapBase;

export type TextRoadmap = {
	text: string;
} & RoadmapBase;

export type FlashCardRoadmap = {
	flashCards: FlashCard[];
} & RoadmapBase;

export type QuestionRoadmap = {
	questions: Question[];
} & RoadmapBase;

export type AudioRoadmap = {} & RoadmapBase;

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
