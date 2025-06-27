import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserResponseDto> {
    const { nickname, password, name } = signUpDto;

    // 닉네임 중복 확인
    const existingUser = await this.userRepository.findUserByNickname(nickname);

    if (existingUser) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    // 새 사용자 엔티티 생성
    const user = new User();
    user.nickname = nickname;
    user.name = name;
    
    // 비밀번호 해시화
    await user.hashPassword(password);
    
    // 사용자 저장 (Repository에서 UserResponseDto 반환)
    return this.userRepository.createUser(user);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string; user: UserResponseDto }> {
    const { nickname, password } = signInDto;

    // 사용자 찾기 (User 엔티티 필요 - 비밀번호 검증용)
    const user = await this.userRepository.findUserByNickname(nickname);

    if (!user) {
      throw new UnauthorizedException('닉네임 또는 비밀번호가 잘못되었습니다.');
    }

    // 비밀번호 검증 (엔티티 메서드 사용)
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('닉네임 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성
    const payload = { nickname: user.nickname };
    const accessToken = this.jwtService.sign(payload);

    // UserResponseDto 반환
    const userResponse = await this.userRepository.findByNickname(nickname);

    return {
      accessToken,
      user: userResponse!,
    };
  }
} 