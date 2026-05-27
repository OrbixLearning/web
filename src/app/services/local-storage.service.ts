import { computed, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export type LocalStorageData = {
	chatExpanded: boolean;
};

const DEFAULT_STORAGE_DATA: LocalStorageData = {
	chatExpanded: true,
};

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly LOCAL_STORAGE_KEY = environment.LOCAL_STORAGE_KEY;

	private state = signal<LocalStorageData>(this.loadFromStorage());

	public readonly data = this.state.asReadonly();

	private loadFromStorage(): LocalStorageData {
		const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
		const parsedData = data ? JSON.parse(data) : {};
		return { ...DEFAULT_STORAGE_DATA, ...parsedData };
	}

	private saveToStorage(data: LocalStorageData): void {
		localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
	}

	set<K extends keyof LocalStorageData>(key: K, value: LocalStorageData[K]): void {
		this.state.update(current => {
			const newState = { ...current, [key]: value };
			this.saveToStorage(newState);
			return newState;
		});
	}

	get<K extends keyof LocalStorageData>(key: K): Signal<LocalStorageData[K]> {
		return computed(() => this.state()[key]);
	}

	remove<K extends keyof LocalStorageData>(key: K): void {
		this.state.update(current => {
			const newState = { ...current };
			delete newState[key];
			this.saveToStorage(newState);
			return newState;
		});
	}

	clear(): void {
		this.state.set({ ...DEFAULT_STORAGE_DATA });
		localStorage.removeItem(this.LOCAL_STORAGE_KEY);
	}
}
