import { IsString, MinLength, MaxLength, Matches, Validate } from 'class-validator';
import { IsPasswordNotContainNickname } from '../validators/password-validator';

export class SignInDto {
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @MinLength(3, { message: '닉네임은 최소 3자 이상이어야 합니다.' })
  @MaxLength(20, { message: '닉네임은 최대 20자까지 가능합니다.' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: '닉네임은 영문자와 숫자만 가능합니다.' })
  nickname: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자까지 가능합니다.' })
  @Validate(IsPasswordNotContainNickname)
  password: string;
} 