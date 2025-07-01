import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';
import { BoardModule } from '../board/board.module';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User]),
    BoardModule, // BoardService를 사용하기 위해 import
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, UserRepository],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {} 