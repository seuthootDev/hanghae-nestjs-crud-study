import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
} 