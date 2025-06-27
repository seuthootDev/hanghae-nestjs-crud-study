import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  nickname: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 비밀번호 검증
   * @param password 검증할 비밀번호
   * @returns 비밀번호 일치 여부
   */
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  /**
   * 비밀번호 해시화
   * @param password 해시화할 비밀번호
   */
  async hashPassword(password: string): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
} 