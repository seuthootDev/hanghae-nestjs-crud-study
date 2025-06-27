import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    password: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}