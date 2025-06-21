import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../configs/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Board } from './board.entity';
import { CommentController } from '../comment/comment.controller';
import { CommentService } from '../comment/comment.service';
import { CommentRepository } from '../comment/comment.repository';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 환경변수를 사용할 수 있도록
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Board, Comment]), // Board와 Comment 엔티티 등록
  ],
  controllers: [BoardController, CommentController],
  providers: [BoardService, BoardRepository, CommentService, CommentRepository], // 모든 서비스와 리포지토리 등록
})
export class AppModule {}
