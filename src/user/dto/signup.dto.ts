import { IsString, MinLength, MaxLength, Matches, Validate, IsNotEmpty } from 'class-validator';
import { IsPasswordNotContainNickname } from '../validators/password-validator';
import { IsPasswordMatch } from '../validators/password-match-validator';

export class SignUpDto {
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

  @IsString({ message: '비밀번호 확인은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자까지 가능합니다.' })
  @Validate(IsPasswordMatch)
  passwordConfirm: string;

  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '이름은 최대 20자까지 가능합니다.' })
  name: string;
} 