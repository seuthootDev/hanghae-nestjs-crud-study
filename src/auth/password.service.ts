import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  /**
   * 비밀번호 해시화
   * @param password 해시화할 비밀번호
   * @returns 해시화된 비밀번호
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 비밀번호 검증
   * @param password 검증할 비밀번호
   * @param hashedPassword 해시화된 비밀번호
   * @returns 비밀번호 일치 여부
   */
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
} 