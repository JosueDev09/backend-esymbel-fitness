import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/role.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    // Debugging line
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Asignar rol por defecto si no se proporciona
    const userRoles = registerDto.roles || [Role.USER];

    // Crear nuevo usuario
    const newUser = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      roles: userRoles,
    });

    // Guardar en la base de datos
    const savedUser = await this.userRepository.save(newUser);

    // Generar token con roles
    const payload = {
      sub: savedUser.id.toString(),
      email: savedUser.email,
      roles: savedUser.roles,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        roles: savedUser.roles,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario en la base de datos
    //console.log('Login DTO:', loginDto); // Debugging line
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    //console.log('Usuario encontrado:', user); // Debugging line

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    // console.log('¿Contraseña válida?:', isPasswordValid); // Debugging line

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token con roles
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);
    console.log('Token generado:', token); // Debugging line

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
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
    });

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
