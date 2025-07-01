import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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
    const responseDtos = await Promise.all(boards.map(board => this.toResponseDto(board)));
    return responseDtos;
  }

  /**
   * 특정 게시글 조회
   */
  async findOne(id: string): Promise<BoardResponseDto | null> {
    const board = await this.boardRepository.findOne(id);
    return board ? await this.toResponseDto(board) : null;
  }

  /**
   * 게시글 생성
   */
  async createBoard(createBoardDto: CreateBoardDto, userId: string): Promise<BoardResponseDto> {
    const board = await this.boardRepository.createBoard(createBoardDto, userId);
    return await this.toResponseDto(board);
  }

  /**
   * 게시글 수정 (JWT 인증 + 비밀번호 확인)
   */
  async updateBoard(id: string, updateBoardDto: UpdateBoardDto, userId: string, password: string): Promise<BoardResponseDto | null> {
    const board = await this.boardRepository.findOne(id);
    
    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 1단계: JWT 인증 확인 (작성자 확인)
    if (board.userId !== userId) {
      throw new UnauthorizedException('게시글을 수정할 권한이 없습니다.');
    }

    // 2단계: 비밀번호 확인
    const isPasswordValid = await this.boardRepository.verifyPassword(id, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const updatedBoard = await this.boardRepository.updateBoard(id, updateBoardDto);
    return updatedBoard ? await this.toResponseDto(updatedBoard) : null;
  }

  /**
   * 게시글 삭제 (JWT 인증 + 비밀번호 확인)
   */
  async deleteBoard(id: string, userId: string, password: string) {
    const board = await this.boardRepository.findOne(id);
    
    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 1단계: JWT 인증 확인 (작성자 확인)
    if (board.userId !== userId) {
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    }

    // 2단계: 비밀번호 확인
    const isPasswordValid = await this.boardRepository.verifyPassword(id, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return this.boardRepository.deleteBoard(id);
  }

  /**
   * 응답 DTO로 변환
   */
  private async toResponseDto(board: Board): Promise<BoardResponseDto> {
    const userNickname = await this.boardRepository.getUserNicknameById(board.userId);
    
    return {
      _id: board._id,
      title: board.title,
      content: board.content,
      userNickname: userNickname || '알 수 없는 사용자',
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}
