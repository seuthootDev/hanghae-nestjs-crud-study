import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
export class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(passwordConfirm: string, args: ValidationArguments) {
    const object = args.object as any;
    const password = object.password;
    
    if (!password || !passwordConfirm) {
      return false; // password나 passwordConfirm이 없으면 검증 실패
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    return password === passwordConfirm;
  }

  defaultMessage(args: ValidationArguments) {
    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
  }
} 