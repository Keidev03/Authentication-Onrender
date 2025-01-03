import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class MatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirm: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class DAccountBodyPost {
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth: Date;
    gender: string;
    email: string;
    password: string;
    confirm: string;
}
