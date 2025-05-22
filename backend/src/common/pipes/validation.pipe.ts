/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/pipes/validation.pipe.ts
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown, unknown> {
  transform(value: unknown, { metatype }: ArgumentMetadata): unknown {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain object to class instance
    const object = plainToInstance(metatype, value as object);
    // Validate with class-validator
    const errors: ValidationError[] = validateSync(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      // Build list of error messages without using any
      const messages: string[] = [];
      for (const err of errors) {
        if (err.constraints) {
          for (const constraintMsg of Object.values(err.constraints)) {
            messages.push(constraintMsg);
          }
        }
      }
      throw new BadRequestException(messages);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const nonPrimitives: Function[] = [String, Boolean, Number, Array, Object];
    return !nonPrimitives.includes(metatype);
  }
}
