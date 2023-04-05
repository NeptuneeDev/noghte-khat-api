import {
  IsString,
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import clientMessages from 'src/common/translation/fa';

export function IsValidRatingField(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RatingValidator,
    });
  };
}

@ValidatorConstraint({ name: 'ratingField', async: false })
export class RatingValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const len = value?.length;
    const number = +value;

    if (len > 3 || number > 5) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return clientMessages.rate.fieldMustBeValid;
  }
}
