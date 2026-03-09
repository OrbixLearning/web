export type AIChatMessage = {
	id?: string;
	content: string;
	userMessage: boolean;
	containsFile: boolean;
};
