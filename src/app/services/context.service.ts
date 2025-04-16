import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Classroom } from '../models/Classroom';
import { Institution } from '../models/Institution';
import { User, UserAccount } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  http: HttpClient = inject(HttpClient);
  private userSignal = signal<User | undefined>(undefined);
  private userAccountSignal = signal<UserAccount | undefined>(undefined);
  private institutionSignal = signal<Institution | undefined>(undefined);
  private classroomSignal = signal<Classroom | undefined>(undefined);

  // GETTERS
  get user(): User | undefined {
    return this.userSignal();
  }
  get userAccount(): UserAccount | undefined {
    return this.userAccountSignal();
  }
  get institution(): Institution | undefined {
    return this.institutionSignal();
  }
  get classroom(): Classroom | undefined {
    return this.classroomSignal();
  }

  // SETTERS
  set user(value: User | undefined) {
    this.userSignal.set({ ...value });
  }
  set userAccount(value: UserAccount | undefined) {
    this.userAccountSignal.set({ ...value });
  }
  set institution(value: Institution | undefined) {
    this.institutionSignal.set({ ...value });
  }
  set classroom(value: Classroom | undefined) {
    this.classroomSignal.set({ ...value });
  }

  // CLEAR
  clearUser() {
    this.userSignal.set(undefined);
    this.clearUserAccount();
    this.clearInstitution();
  }
  clearUserAccount() {
    this.userAccountSignal.set(undefined);
  }
  clearInstitution() {
    this.institutionSignal.set(undefined);
    this.clearClassroom();
  }
  clearClassroom() {
    this.classroomSignal.set(undefined);
  }
}
