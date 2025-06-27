import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 닉네임으로 사용자 찾기 (UserResponseDto 반환)
   * @param nickname 사용자 닉네임
   * @returns 사용자 정보 또는 null
   */
  async findByNickname(nickname: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { nickname },
    });

    return user ? {
      nickname: user.nickname,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } : null;
  }

  /**
   * 닉네임으로 사용자 찾기 (User 엔티티 반환 - 내부용)
   * @param nickname 사용자 닉네임
   * @returns 사용자 엔티티 또는 null
   */
  async findUserByNickname(nickname: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { nickname },
    });
  }

  /**
   * 새 사용자 생성
   * @param userData 사용자 데이터
   * @returns 생성된 사용자 정보 (UserResponseDto)
   */
  async createUser(userData: Partial<User>): Promise<UserResponseDto> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    
    return {
      nickname: savedUser.nickname,
      name: savedUser.name,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
} 