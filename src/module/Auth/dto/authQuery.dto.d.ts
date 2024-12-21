import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsKniteDomainConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class DAuthQuery {
    continue: string;
}
