import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 전체 게시글 목록 조회
   */
  @Get()
  async getAllBoards(): Promise<BoardResponseDto[]> {
    return this.boardService.findAll();
  }

  /**
   * 특정 게시글 조회
   */
  @Get(':id')
  async getBoard(@Param('id') id: string): Promise<BoardResponseDto> {
    const board = await this.boardService.findOne(id);
    if (!board) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    return board;
  }

  /**
   * 게시글 작성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @User('_id') userId: string
  ): Promise<BoardResponseDto> {
    return this.boardService.createBoard(createBoardDto, userId);
  }

  /**
   * 게시글 수정
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @User('_id') userId: string
  ): Promise<BoardResponseDto> {
    const { password, ...updateData } = updateBoardDto;
    if (!password) {
      throw new Error('비밀번호는 필수입니다.');
    }
    const updatedBoard = await this.boardService.updateBoard(id, updateData, userId, password);
    if (!updatedBoard) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    
    return updatedBoard;
  }

  /**
   * 게시글 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBoard(
    @Param('id') id: string,
    @Body() body: { password: string },
    @User('_id') userId: string
  ) {
    if (!body.password) {
      throw new Error('비밀번호는 필수입니다.');
    }
    await this.boardService.deleteBoard(id, userId, body.password);
    
    return { message: '게시글이 삭제되었습니다.' };
  }
}
