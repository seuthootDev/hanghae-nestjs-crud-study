import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository) {}

  /**
   * 모든 게시글 조회
   */
  async findAll(): Promise<Board[]> {
    return this.boardRepository.findAll();
  }

  /**
   * 특정 게시글 조회
   */
  async findOne(id: string): Promise<Board | null> {
    return this.boardRepository.findOne(id);
  }

  /**
   * 게시글 생성
   */
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  /**
   * 게시글 수정
   */
  async updateBoard(id: string, updateBoardDto: UpdateBoardDto): Promise<Board | null> {
    return this.boardRepository.updateBoard(id, updateBoardDto);
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
}
