import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /**
   * 댓글 생성
   * @param createCommentDto 댓글 생성 데이터
   * @returns 생성된 댓글 정보
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    const comment = this.commentRepository.create({
      author: createCommentDto.author,
      content: createCommentDto.content,
      boardId: createCommentDto.boardId,
    });
    
    const savedComment = await this.commentRepository.save(comment);
    
    return {
      id: savedComment._id.toString(),
      content: savedComment.content,
      author: savedComment.author,
      boardId: savedComment.boardId,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,
    };
  }

  /**
   * 특정 게시글의 모든 댓글 조회
   * @param boardId 게시글 ID
   * @returns 댓글 목록 (작성 시간 순)
   */
  async findAllByBoardId(boardId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { boardId },
      order: { createdAt: 'ASC' },
    });

    return comments.map(comment => ({
      id: comment._id.toString(),
      content: comment.content,
      author: comment.author,
      boardId: comment.boardId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
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
   * @returns 수정된 댓글 정보 또는 null
   */
  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto | null> {
    const comment = await this.findOne(id);
    if (!comment) {
      return null;
    }

    // content만 수정 가능
    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }

    const updatedComment = await this.commentRepository.save(comment);

    return {
      id: updatedComment._id.toString(),
      content: updatedComment.content,
      author: updatedComment.author,
      boardId: updatedComment.boardId,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
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
} 