import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ObjectId } from 'mongodb';
import { PasswordService } from '../auth/password.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class BoardRepository {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private passwordService: PasswordService,
        private userRepository: UserRepository
    ) {}

    /**
     * 새로운 게시글을 생성하는 메서드
     * @param createBoardDto - 게시글 생성에 필요한 데이터
     * @param userId - JWT에서 추출한 사용자 _id
     * @returns 생성된 Board 엔티티
     */
    async createBoard(createBoardDto: CreateBoardDto, userId: string): Promise<Board> {
        const { title, content, password } = createBoardDto;
        
        // 비밀번호 해시화
        const hashedPassword = await this.passwordService.hashPassword(password);
        
        const board = this.boardRepository.create({ 
            title, 
            content,
            password: hashedPassword,
            userId: userId, // 닉네임 문자열만 저장
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await this.boardRepository.save(board);
        return board;
    }

    /**
     * 모든 게시글을 조회하는 메서드 (작성일 기준 내림차순)
     * @returns 모든 Board 엔티티 배열
     */
    async findAll(): Promise<Board[]> {
        return this.boardRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * ID로 특정 게시글을 조회하는 메서드
     * @param id - 조회할 게시글의 ID
     * @returns 찾은 Board 엔티티 또는 null
     */
    async findOne(id: string): Promise<Board | null> {
        return this.boardRepository.findOne({ where: { _id: new ObjectId(id) } });
    }

    /**
     * 게시글을 수정하는 메서드
     * @param id - 수정할 게시글의 ID
     * @param updateBoardDto - 수정할 데이터
     * @returns 수정된 Board 엔티티
     */
    async updateBoard(id: string, updateBoardDto: UpdateBoardDto): Promise<Board | null> {
        const board = await this.findOne(id);
        if (!board) return null;

        Object.assign(board, {
            ...updateBoardDto,
            updatedAt: new Date()
        });

        return this.boardRepository.save(board);
    }

    /**
     * 게시글을 삭제하는 메서드
     * @param id - 삭제할 게시글의 ID
     * @returns 삭제 결과
     */
    async deleteBoard(id: string) {
        return this.boardRepository.delete(new ObjectId(id));
    }

    /**
     * 비밀번호 확인 메서드
     * @param id - 게시글 ID
     * @param password - 확인할 비밀번호
     * @returns 비밀번호 일치 여부
     */
    async verifyPassword(id: string, password: string): Promise<boolean> {
        const board = await this.findOne(id);
        if (!board) return false;
        
        return this.passwordService.validatePassword(password, board.password);
    }

    /**
     * 사용자 ID로 닉네임 조회
     * @param userId - 사용자 ID
     * @returns 사용자 닉네임 또는 null
     */
    async getUserNicknameById(userId: string): Promise<string | null> {
        const user = await this.userRepository.findUserById(userId);
        return user ? user.userNickname : null;
    }
} 