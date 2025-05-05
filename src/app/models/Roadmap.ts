import { Institution } from './Institution';
import { Syllabus } from './Syllabus';
import { User } from './User';

export type Roadmap = VideoRoadmap | TextRoadmap | QuestionRoadmap | FlashCardRoadmap | AudioRoadmap;

type RoadmapTopClass = {
	id: string;
	name: string;
	syllabus: Syllabus[];
	user: User;
	institution: Institution;
};

export type VideoRoadmap = {
	videoLinks: string[];
} & RoadmapTopClass;

export type TextRoadmap = {
	text: string;
} & RoadmapTopClass;

export type QuestionRoadmap = {} & RoadmapTopClass;
export type FlashCardRoadmap = {} & RoadmapTopClass;
export type AudioRoadmap = {} & RoadmapTopClass;
