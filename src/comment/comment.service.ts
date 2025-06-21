import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.commentRepository.createComment(createCommentDto);
  }

  async findAllByBoardId(boardId: string): Promise<CommentResponseDto[]> {
    return this.commentRepository.findAllByBoardId(boardId);
  }

  async findOne(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) {
      return null;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      author: comment.author,
      boardId: comment.boardId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto | null> {
    return this.commentRepository.updateComment(id, updateCommentDto);
  }

  async deleteComment(id: string): Promise<{ affected: number }> {
    return this.commentRepository.deleteComment(id);
  }
} 