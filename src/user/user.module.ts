import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { jwtConfig } from '../configs/jwt.config';
import { IsPasswordNotContainNickname } from './validators/password-validator';
import { IsPasswordMatch } from './validators/password-match-validator';
import { PasswordService } from '../auth/password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(jwtConfig),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    UserRepository, 
    JwtStrategy, 
    IsPasswordNotContainNickname,
    IsPasswordMatch,
    PasswordService
  ],
  exports: [UserService],
})
export class UserModule {} 