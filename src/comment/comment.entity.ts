import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('comments')
export class Comment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  content: string;

  @Column()
  userId: string;

  @Column()
  boardId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 