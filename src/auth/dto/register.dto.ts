import { Role } from '../enums/role.enum';

export class RegisterDto {
  email: string;
  password: string;
  name: string;
  roles?: Role[];
}
