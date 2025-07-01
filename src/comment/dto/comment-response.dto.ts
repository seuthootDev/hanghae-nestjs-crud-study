import { ObjectId } from 'mongodb';

export class CommentResponseDto {
  _id: ObjectId;
  content: string;
  userId: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
} 