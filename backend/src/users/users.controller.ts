import { Body, Controller, Post, HttpStatus, Req, Res } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './users.service';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/helper/api_response';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Response<ApiResponse>> {
    try {
      const checkAlreadyExists = await this.userService.findOneByEmail(
        registerUserDto.email,
      );
      if (checkAlreadyExists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: 'Email is already in use',
        });
      }

      const isRegistered = await this.userService.register(registerUserDto);
      if (!isRegistered) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: 'User registration failed',
        });
      }

      return res.status(HttpStatus.CREATED).json({
        status: true,
        message: 'User registered successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<Response<ApiResponse>> {
    try {
      const checkValidDetails = await this.userService.login(loginUserDto);
      if (!checkValidDetails) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: false,
          message: 'Invalid email or password',
        });
      }

      const user = await this.userService.findOneByEmail(loginUserDto.email);

      const token = await this.userService.generateAccessToken(user.id);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: 'Login successful',
        data: { token },
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: false,
        message: 'Invalid email or password',
      });
    }
  }
}
