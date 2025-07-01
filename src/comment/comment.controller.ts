import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { BoardService } from '../board/board.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { ObjectId } from 'mongodb';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly boardService: BoardService,
  ) {}

  /**
   * ObjectId 유효성 검사 함수
   */
  private isValidObjectId(id: string): boolean {
    try {
      new ObjectId(id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 특정 게시글의 댓글 목록 조회
   */
  @Get('board/:boardId')
  async findByBoardId(@Param('boardId') boardId: string): Promise<CommentResponseDto[]> {
    if (!this.isValidObjectId(boardId)) {
      throw new BadRequestException('올바르지 않은 게시글 ID 형식입니다.');
    }
    return this.commentService.findByBoardId(boardId);
  }

  /**
   * 특정 댓글 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('올바르지 않은 댓글 ID 형식입니다.');
    }
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  /**
   * 댓글 작성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @User('_id') userId: string
  ): Promise<CommentResponseDto> {
    // boardId 유효성 검사
    if (!this.isValidObjectId(createCommentDto.boardId)) {
      throw new BadRequestException('올바르지 않은 게시글 ID 형식입니다.');
    }

    // 게시글이 존재하는지 확인
    const board = await this.boardService.findOne(createCommentDto.boardId);
    if (!board) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    return this.commentService.createComment(createCommentDto, userId);
  }

  /**
   * 댓글 수정
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User('nickname') userNickname: string
  ): Promise<CommentResponseDto> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('올바르지 않은 댓글 ID 형식입니다.');
    }
    
    const updatedComment = await this.commentService.updateComment(id, updateCommentDto, userNickname);
    if (!updatedComment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    
    return updatedComment;
  }

  /**
   * 댓글 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @User('nickname') userNickname: string
  ) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('올바르지 않은 댓글 ID 형식입니다.');
    }
    
    await this.commentService.deleteComment(id, userNickname);
    
    return { message: '댓글이 삭제되었습니다.' };
  }
} 