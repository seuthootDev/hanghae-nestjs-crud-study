import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateBoardDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    password?: string;

    @IsOptional()
    @IsString()
    content?: string;
} 