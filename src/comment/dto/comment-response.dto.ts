import { ObjectId } from 'mongodb';

export class CommentResponseDto {
  _id: ObjectId;
  content: string;
  userNickname: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
} 