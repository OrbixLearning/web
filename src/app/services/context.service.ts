import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Classroom } from '../models/Classroom';
import { Institution } from '../models/Institution';
import { User } from '../models/User';
import { ClassroomService } from './classroom.service';
import { InstitutionService } from './institution.service';

@Injectable({
	providedIn: 'root',
})
export class ContextService {
	http: HttpClient = inject(HttpClient);
	institutionService: InstitutionService = inject(InstitutionService);
	classroomService: ClassroomService = inject(ClassroomService);

	private userSignal = signal<User | undefined>(undefined);
	private institutionListSignal = signal<Institution[]>([]);
	private institutionSignal = signal<Institution | undefined>(undefined);
	private institutionRoleSignal = signal<InstitutionRoleEnum | undefined>(undefined);
	private classroomListSignal = signal<Classroom[]>([]);
	private classroomSignal = signal<Classroom | undefined>(undefined);

	constructor() {
		effect(() => {
			const user = this.userSignal();
			if (user) {
				lastValueFrom(this.institutionService.getUserInstitutions()).then((institutions: Institution[]) => {
					this.institutionList = institutions;
				});
			} else {
				this.clearInstitutionList();
			}
		});

		effect(() => {
			const institution = this.institutionSignal();
			if (institution && institution.id) {
				Promise.all([
					lastValueFrom(this.classroomService.getClassrooms(institution.id)),
					lastValueFrom(this.institutionService.getInstitutionRole(institution.id)),
				]).then(([classrooms, role]) => {
					this.classroomList = classrooms;
					this.institutionRole = role;
				});
				this.clearClassroom();
			} else {
				this.clearClassroomList();
				this.clearInstitutionRole();
			}
		});
	}

	// GETTERS
	get user(): User | undefined {
		return this.userSignal();
	}
	get institutionList(): Institution[] {
		return this.institutionListSignal();
	}
	get institution(): Institution | undefined {
		return this.institutionSignal();
	}
	get institutionRole(): InstitutionRoleEnum | undefined {
		return this.institutionRoleSignal();
	}
	get classroomList(): Classroom[] {
		return this.classroomListSignal();
	}
	get classroom(): Classroom | undefined {
		return this.classroomSignal();
	}

	// SETTERS
	set user(value: User | undefined) {
		this.userSignal.set(value ? { ...value } : undefined);
	}
	set institutionList(value: Institution[]) {
		this.institutionListSignal.set([...value]);
	}
	set institution(value: Institution | undefined) {
		this.institutionSignal.set(value ? { ...value } : undefined);
	}
	set institutionRole(value: InstitutionRoleEnum | undefined) {
		this.institutionRoleSignal.set(value);
	}
	set classroomList(value: Classroom[]) {
		this.classroomListSignal.set([...value]);
	}
	set classroom(value: Classroom | undefined) {
		this.classroomSignal.set(value ? { ...value } : undefined);
	}

	// CLEAR
	clearUser() {
		this.userSignal.set(undefined);
		this.clearInstitutionList();
	}
	clearInstitutionList() {
		this.institutionListSignal.set([]);
		this.clearInstitution();
		this.clearInstitutionRole();
	}
	clearInstitution() {
		this.institutionSignal.set(undefined);
		this.clearClassroomList();
	}
	clearInstitutionRole() {
		this.institutionRoleSignal.set(undefined);
	}
	clearClassroomList() {
		this.classroomListSignal.set([]);
		this.clearClassroom();
	}
	clearClassroom() {
		this.classroomSignal.set(undefined);
	}
}
