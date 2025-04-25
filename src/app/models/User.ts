import { AuthMethodEnum } from '../enums/AuthMethod.enum';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Institution } from './Institution';
import { Role } from './Role';

export type User = {
	id: string;
	accounts: UserAccount[];
	firstName: string;
	surName: string;
	role: Role;
	profilePicture: string | null;

	createdInstitutions?: Institution[];
};

export type UserAccount = {
	id: string;
	email: string;
	authMethod: AuthMethodEnum;
	institution: Institution;
	institutionRole: InstitutionRoleEnum;
	user: User;
	active: boolean;
};
