import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { PasswordService } from '../auth/password.service';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, User]),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, PasswordService, UserRepository],
  exports: [BoardService, BoardRepository], // 다른 모듈에서 사용할 수 있도록
})
export class BoardModule {}
