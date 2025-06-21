export class BoardResponseDto {
    _id: string;
    title: string;
    author: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    
    // password 필드는 제외 (보안상 이유)
} 