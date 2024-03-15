import { registerDecorator, ValidationOptions } from 'class-validator';

export function StrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'StrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => {
          const strongPasswordRegex =
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
          return strongPasswordRegex.test(value);
        },
        defaultMessage: () =>
          JSON.stringify({
            type: 'password',
            message: 'A senha é muito fraca.',
          }),
      },
    });
  };
}
