import { Classroom } from './Classroom';
import { User, UserAccount } from './User';

export type Institution = {
  id?: string;
  name?: string;
  creator?: User;
  accounts?: UserAccount[];
  classrooms?: Classroom[];
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
};
