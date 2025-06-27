import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponseDto> {
    return this.userService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string; user: UserResponseDto }> {
    return this.userService.signIn(signInDto);
  }
} 