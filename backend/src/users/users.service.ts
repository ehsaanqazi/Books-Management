import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entity/user.entity';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<boolean> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const isPasswordValid = await this.comparePasswords(
        password,
        user.password,
      );
      if (isPasswordValid) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  async generateAccessToken(id: number): Promise<string> {
    const jwtService = new JwtService();
    const token = jwtService.signAsync(
      {
        id: id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '90d',
      },
    );
    return token;
  }

  private async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  async getUserFromAccessToken(req: any) {
    const authorization = req.headers.authorization;
    if (authorization) {
      const authHeader = authorization;
      const token = authHeader.split(' ')[1];
      const decoded = jwtDecode(token);
      const userId = decoded['id'];
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      return user;
    }
  }
}
