import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private userRepository: UserRepository,
  ) {}

  /**
   * 댓글 생성
   * @param createCommentDto 댓글 생성 데이터
   * @param userId 사용자 ID
   * @returns 생성된 댓글 엔티티
   */
  async createComment(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      boardId: createCommentDto.boardId,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return await this.commentRepository.save(comment);
  }

  /**
   * 특정 게시글의 모든 댓글 조회
   * @param boardId 게시글 ID
   * @returns 댓글 목록 내림차순(최신작성순)
   */
  async findByBoardId(boardId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { boardId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 댓글 조회
   * @param id 댓글 ID
   * @returns 댓글 정보 또는 null
   */
  async findOne(id: string): Promise<Comment | null> {
    return this.commentRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  /**
   * 댓글 수정
   * @param id 댓글 ID
   * @param updateCommentDto 수정할 데이터
   * @returns 수정된 댓글 엔티티 또는 null
   */
  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
    const comment = await this.findOne(id);
    if (!comment) {
      return null;
    }

    // content만 수정 가능
    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }

    return await this.commentRepository.save(comment);
  }

  /**
   * 댓글 삭제
   * @param id 댓글 ID
   * @returns 삭제된 댓글 수
   */
  async deleteComment(id: string): Promise<{ affected: number }> {
    const result = await this.commentRepository.delete(new ObjectId(id));
    return { affected: result.affected || 0 };
  }

  /**
   * 사용자 ID로 닉네임 조회
   * @param userId - 사용자 ID
   * @returns 사용자 닉네임 또는 null
   */
  async getUserNicknameById(userId: string): Promise<string | null> {
    const user = await this.userRepository.findUserById(userId);
    return user ? user.userNickname : null;
  }
} 