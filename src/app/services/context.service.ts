import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Classroom } from '../models/Classroom';
import { Institution } from '../models/Institution';
import { Roadmap } from '../models/Roadmap';
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

	// These values are populated in guards
	private userSignal = signal<User | undefined>(undefined);
	private institutionSignal = signal<Institution | undefined>(undefined);
	private classroomSignal = signal<Classroom | undefined>(undefined);
	private roadmapSignal = signal<Roadmap | undefined>(undefined);

	// These values are populated in the context service effects
	private institutionListSignal = signal<Institution[] | undefined>(undefined);
	private institutionRolesSignal = signal<InstitutionRoleEnum[] | undefined>(undefined);
	private classroomListSignal = signal<Classroom[] | undefined>(undefined);

	public institutionListLoading: boolean = false;
	public institutionRolesLoading: boolean = false;
	public classroomListLoading: boolean = false;

	constructor() {
		effect(() => {
			const user = this.userSignal();
			if (user) {
				if (!this.institutionListLoading) this.loadInstitutionList();
			} else {
				this.clearInstitutionList();
			}
		});

		effect(() => {
			const institution = this.institutionSignal();
			if (institution && institution.id) {
				Promise.all([this.loadClassroomList(), this.loadInstitutionRoles()]);
			} else {
				this.clearClassroomList();
				this.clearInstitutionRoles();
			}
		});
	}

	// GETTERS
	get user(): User | undefined {
		return this.userSignal();
	}
	get institutionList(): Institution[] | undefined {
		return this.institutionListSignal();
	}
	get institution(): Institution | undefined {
		return this.institutionSignal();
	}
	get institutionRoles(): InstitutionRoleEnum[] | undefined {
		return this.institutionRolesSignal();
	}
	get classroomList(): Classroom[] | undefined {
		return this.classroomListSignal();
	}
	get classroom(): Classroom | undefined {
		return this.classroomSignal();
	}
	get roadmap(): Roadmap | undefined {
		return this.roadmapSignal();
	}

	// SETTERS
	set user(value: User | undefined) {
		this.userSignal.set(value ? { ...value } : undefined);
	}
	set institutionList(value: Institution[] | undefined) {
		this.institutionListSignal.set(value ? [...value] : undefined);
	}
	set institution(value: Institution | undefined) {
		this.institutionSignal.set(value ? { ...value } : undefined);
	}
	set institutionRoles(value: InstitutionRoleEnum[] | undefined) {
		this.institutionRolesSignal.set(value ? [...value] : undefined);
	}
	set classroomList(value: Classroom[] | undefined) {
		this.classroomListSignal.set(value ? [...value] : undefined);
	}
	set classroom(value: Classroom | undefined) {
		this.classroomSignal.set(value ? { ...value } : undefined);
	}
	set roadmap(value: Roadmap | undefined) {
		this.roadmapSignal.set(value ? { ...value } : undefined);
	}

	// CLEAR
	clearUser() {
		this.userSignal.set(undefined);
		this.clearInstitutionList();
	}
	clearInstitutionList() {
		this.institutionListSignal.set(undefined);
		this.clearInstitution();
		this.clearInstitutionRoles();
	}
	clearInstitution() {
		this.institutionSignal.set(undefined);
		this.clearClassroomList();
	}
	clearInstitutionRoles() {
		this.institutionRolesSignal.set(undefined);
	}
	clearClassroomList() {
		this.classroomListSignal.set(undefined);
		this.clearClassroom();
	}
	clearClassroom() {
		this.classroomSignal.set(undefined);
	}
	clearRoadmap() {
		this.roadmapSignal.set(undefined);
	}

	// LOAD
	async loadInstitutionList() {
		this.institutionListLoading = true;
		await lastValueFrom(this.institutionService.getUserInstitutions()).then((institutions: Institution[]) => {
			this.institutionList = institutions;
			this.institutionListLoading = false;
		});
	}
	async loadInstitutionRoles() {
		this.institutionRolesLoading = true;
		await lastValueFrom(this.institutionService.getInstitutionRoles(this.institution!.id!)).then(
			(roles: InstitutionRoleEnum[]) => {
				this.institutionRoles = roles;
				this.institutionRolesLoading = false;
			},
		);
	}
	async loadClassroomList() {
		this.classroomListLoading = true;
		await lastValueFrom(this.classroomService.getUserClassrooms(this.institution!.id!)).then(
			(classrooms: Classroom[]) => {
				this.classroomList = classrooms;
				this.classroomListLoading = false;
			},
		);
	}

	// MISC
	get isTeacher(): boolean {
		let professorRoles = [InstitutionRoleEnum.CREATOR, InstitutionRoleEnum.ADMIN, InstitutionRoleEnum.TEACHER];
		return professorRoles.some(role => this.institutionRoles?.includes(role));
	}
}
