export type Page<T> = {
	content : T[];
	number : number;
	numberOfElements : number;
	size : number;
	totalElements : number;
	totalPages : number;
}