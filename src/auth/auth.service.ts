import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  // Simulación de base de datos (en producción usar TypeORM, Prisma, etc.)
  private users: Array<{
    id: string;
    email: string;
    password: string;
    name: string;
    roles: Role[];
  }> = [];

  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = this.users.find(
      (user) => user.email === registerDto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Asignar rol por defecto si no se proporciona
    const userRoles = registerDto.roles || [Role.USER];

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      roles: userRoles,
    };

    this.users.push(newUser);

    // Generar token con roles
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const user = this.users.find((user) => user.email === loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token con roles
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async validateUser(userId: string) {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
  }
}
