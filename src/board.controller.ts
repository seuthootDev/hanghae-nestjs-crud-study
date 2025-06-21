import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';

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
      throw new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return board;
  }

  /**
   * 게시글 작성
   */
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<BoardResponseDto> {
    return this.boardService.createBoard(createBoardDto);
  }

  /**
   * 게시글 수정
   */
  @Put(':id')
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto & { password: string }
  ): Promise<BoardResponseDto> {
    const { password, ...updateData } = updateBoardDto;
    
    // 비밀번호 확인
    const isPasswordValid = await this.boardService.verifyPassword(id, password);
    if (!isPasswordValid) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const updatedBoard = await this.boardService.updateBoard(id, updateData);
    if (!updatedBoard) {
      throw new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    
    return updatedBoard;
  }

  /**
   * 게시글 삭제
   */
  @Delete(':id')
  async deleteBoard(
    @Param('id') id: string,
    @Body() body: { password: string }
  ) {
    // 비밀번호 확인
    const isPasswordValid = await this.boardService.verifyPassword(id, body.password);
    if (!isPasswordValid) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.boardService.deleteBoard(id);
    if (result.affected === 0) {
      throw new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    
    return { message: '게시글이 삭제되었습니다.' };
  }
}
