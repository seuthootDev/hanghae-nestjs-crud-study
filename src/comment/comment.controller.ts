import { Controller, Get, Post, Patch, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { BoardService } from '../board/board.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly boardService: BoardService,
  ) {}

  /**
   * 특정 게시글의 댓글 목록 조회
   */
  @Get('board/:boardId')
  async getCommentsByBoardId(@Param('boardId') boardId: string): Promise<CommentResponseDto[]> {
    return this.commentService.findAllByBoardId(boardId);
  }

  /**
   * 특정 댓글 조회
   */
  @Get(':id')
  async getComment(@Param('id') id: string): Promise<CommentResponseDto> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  /**
   * 댓글 작성
   */
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    // 게시글이 존재하는지 확인
    const board = await this.boardService.findOne(createCommentDto.boardId);
    if (!board) {
      throw new HttpException('존재하지 않는 게시글입니다.', HttpStatus.BAD_REQUEST);
    }

    return this.commentService.createComment(createCommentDto);
  }

  /**
   * 댓글 수정
   */
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<CommentResponseDto> {
    const updatedComment = await this.commentService.updateComment(id, updateCommentDto);
    if (!updatedComment) {
      throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    
    return updatedComment;
  }

  /**
   * 댓글 삭제
   */
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    const result = await this.commentService.deleteComment(id);
    if (result.affected === 0) {
      throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    
    return { message: '댓글이 삭제되었습니다.' };
  }
} 