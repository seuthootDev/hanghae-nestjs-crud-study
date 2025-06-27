import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordNotContainNickname', async: false })
export class IsPasswordNotContainNickname implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const object = args.object as any;
    const nickname = object.nickname;
    
    if (!nickname || !password) {
      return true; // nickname이나 password가 없으면 검증 통과
    }

    // 대소문자 구분 없이 검사
    const lowerPassword = password.toLowerCase();
    const lowerNickname = nickname.toLowerCase();
    
    // 비밀번호에 닉네임이 포함되어 있으면 false 반환
    return !lowerPassword.includes(lowerNickname);
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    const nickname = object.nickname;
    return `비밀번호에 닉네임 '${nickname}'이 포함될 수 없습니다.`;
  }
} 