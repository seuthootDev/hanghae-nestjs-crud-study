import { ObjectId } from 'mongodb';

export class BoardResponseDto {
    _id: ObjectId;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
} 