import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as clientMessage from '../translation/fa/message.json';
@ValidatorConstraint({ name: 'CustomMatchPasswords', async: false })
export class CustomMatchPasswords implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (password !== (args.object as any)[args.constraints[0]]) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return clientMessage.auth["passworsDon'tMatch"];
  }
}
