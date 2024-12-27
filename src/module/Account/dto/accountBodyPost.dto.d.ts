import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class MatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirm: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsPhoneNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare class DAccountBodyPost {
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    email: string;
    password: string;
    confirm: string;
}
