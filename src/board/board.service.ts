import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository) {}

  /**
   * 모든 게시글 조회
   */
  async findAll(): Promise<BoardResponseDto[]> {
    const boards = await this.boardRepository.findAll();
    return boards.map(board => this.excludePassword(board));
  }

  /**
   * 특정 게시글 조회
   */
  async findOne(id: string): Promise<BoardResponseDto | null> {
    const board = await this.boardRepository.findOne(id);
    return board ? this.excludePassword(board) : null;
  }

  /**
   * 게시글 생성
   */
  async createBoard(createBoardDto: CreateBoardDto): Promise<BoardResponseDto> {
    const board = await this.boardRepository.createBoard(createBoardDto);
    return this.excludePassword(board);
  }

  /**
   * 게시글 수정
   */
  async updateBoard(id: string, updateBoardDto: UpdateBoardDto): Promise<BoardResponseDto | null> {
    const board = await this.boardRepository.updateBoard(id, updateBoardDto);
    return board ? this.excludePassword(board) : null;
  }

  /**
   * 게시글 삭제
   */
  async deleteBoard(id: string) {
    return this.boardRepository.deleteBoard(id);
  }

  /**
   * 비밀번호 확인
   */
  async verifyPassword(id: string, password: string): Promise<boolean> {
    return this.boardRepository.verifyPassword(id, password);
  }

  /**
   * 비밀번호 필드를 제외한 응답 데이터 생성
   */
  private excludePassword(board: Board): BoardResponseDto {
    const { password, ...boardResponse } = board;
    return boardResponse as unknown as BoardResponseDto;
  }
}
