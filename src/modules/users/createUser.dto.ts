import { IsEmail, IsNotEmpty, IsString, Length, IsStrongPassword, IsInt, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, ValidationOptions, registerDecorator, ValidateIf, IsOptional } from "class-validator";


@ValidatorConstraint({ name: 'matchKey', async: false })
export class matchKey implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        console.log({value, args});
        return args.value === args.object[args.constraints[0]];
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} not match with ${args.constraints[0]}`;
    }
}

export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints,
      options: validationOptions,
      validator: matchKey,
    });
  };
}

export class CreateUserDto {

    @IsNotEmpty()
    @IsString({message: "name must be a string"})
    @Length(3,15, {message: "name is too short"})
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsInt()
    age: number;

    @ValidateIf((data: CreateUserDto) => {
        return Boolean(data.password)
    })
    @IsMatch(['password'])
    cPassword: string;

    @IsOptional()
    @IsString()
    phone: string;

}

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}

