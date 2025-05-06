import { Institution } from './Institution';
import { Syllabus } from './Syllabus';
import { User } from './User';

export type Roadmap = VideoRoadmap | TextRoadmap | QuestionRoadmap | FlashCardRoadmap | AudioRoadmap;

type RoadmapBase = {
	id: string;
	name: string;
	syllabus: Syllabus[];
	user: User;
	institution: Institution;
};

export type VideoRoadmap = {
	videoLinks: string[];
} & RoadmapBase;

export type TextRoadmap = {
	text: string;
} & RoadmapBase;

export type QuestionRoadmap = {} & RoadmapBase;
export type FlashCardRoadmap = {} & RoadmapBase;
export type AudioRoadmap = {} & RoadmapBase;
