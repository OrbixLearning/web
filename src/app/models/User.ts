import { AuthMethodEnum } from '../enums/AuthMethod.enum';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Institution } from './Institution';
import { Role } from './Role';

export type User = {
	id: string;
	accounts: UserAccount[];
	name: string;
	role: Role;

	createdInstitutions?: Institution[];
};

export type UserAccount = {
	id: string;
	email: string;
	authMethod: AuthMethodEnum;
	institution: Institution | null;
	institutionRole: InstitutionRoleEnum | null;
	idInInstitution: string | null;
	user: User;
	active: boolean;
};
