import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDateFormatBR(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsDateFormatBR',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => {
          const dateRegex =
            /^(0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)\d\d$/;
          return dateRegex.test(value);
        },
        defaultMessage: () =>
          'Data inválida. Deve estar no formato DD/MM/YYYY.',
      },
    });
  };
}
