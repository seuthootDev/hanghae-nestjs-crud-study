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
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.userService.signUp(signUpDto);
    return { 
      message: "회원가입 성공", 
      statusCode: 200 
    };
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.userService.signIn(signInDto);
    return {
      message: "로그인 성공",
      statusCode: 200,
      accessToken: result.accessToken,
      user: result.user
    };
  }
} 