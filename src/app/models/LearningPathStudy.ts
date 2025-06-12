import { Roadmap } from './LearningPath';
import { User } from './User';

export type RoadmapStudy =
	| VideoRoadmapStudy
	| TextRoadmapStudy
	| QuestionRoadmapStudy
	| FlashCardRoadmapStudy
	| AudioRoadmapStudy;

type RoadmapStudyBase = {
	id: string;
	roadmap: Roadmap;
	user: User;
};

export type VideoRoadmapStudy = {} & RoadmapStudyBase;

export type TextRoadmapStudy = {} & RoadmapStudyBase;

export type FlashCardRoadmapStudy = {} & RoadmapStudyBase;

export type QuestionRoadmapStudy = {} & RoadmapStudyBase;

export type AudioRoadmapStudy = {} & RoadmapStudyBase;
