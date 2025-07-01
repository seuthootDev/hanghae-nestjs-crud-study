import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  /**
   * 특정 게시글의 모든 댓글 조회
   */
  async findByBoardId(boardId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.findByBoardId(boardId);
    const responseDtos = await Promise.all(comments.map(comment => this.toResponseDto(comment)));
    return responseDtos;
  }

  /**
   * 특정 댓글 조회
   */
  async findOne(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.commentRepository.findOne(id);
    return comment ? await this.toResponseDto(comment) : null;
  }

  /**
   * 댓글 생성
   */
  async createComment(createCommentDto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.createComment(createCommentDto, userId);
    return await this.toResponseDto(comment);
  }

  /**
   * 댓글 수정 (작성자 확인)
   */
  async updateComment(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<CommentResponseDto | null> {
    const comment = await this.commentRepository.findOne(id);
    
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // 작성자 확인
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글을 수정할 권한이 없습니다.');
    }

    const updatedComment = await this.commentRepository.updateComment(id, updateCommentDto);
    return updatedComment ? await this.toResponseDto(updatedComment) : null;
  }

  /**
   * 댓글 삭제 (작성자 확인)
   */
  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepository.findOne(id);
    
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // 작성자 확인
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글을 삭제할 권한이 없습니다.');
    }

    return this.commentRepository.deleteComment(id);
  }

  /**
   * 응답 DTO로 변환
   */
  private async toResponseDto(comment: Comment): Promise<CommentResponseDto> {
    const userNickname = await this.commentRepository.getUserNicknameById(comment.userId);
    
    return {
      _id: comment._id,
      content: comment.content,
      userNickname: userNickname || '알 수 없는 사용자',
      boardId: comment.boardId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
} 