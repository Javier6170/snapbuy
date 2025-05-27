// test/common/pipes/validation.pipe.spec.ts
import { BadRequestException } from '@nestjs/common';
import type { ArgumentMetadata } from '@nestjs/common';
import { IsString, IsInt } from 'class-validator';

import { ValidationPipe } from '../../../src/common/pipes/validation.pipe';

class TestDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}

describe('Custom ValidationPipe', () => {
  let pipe: ValidationPipe;
  const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto, data: '' };

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('debe devolver el valor sin validar si es primitivo o no hay metatype', () => {
    expect(pipe.transform('foo', { ...metadata, metatype: String })).toBe('foo');
    expect(pipe.transform('bar', { ...metadata, metatype: undefined })).toBe('bar');
  });

  it('debe transformar y devolver instancia al recibir datos válidos', () => {
    const input = { name: 'Alice', age: 30 };
    const result = pipe.transform(input, metadata) as TestDto;
    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('Alice');
    expect(result.age).toBe(30);
  });

  it('debe lanzar BadRequestException con el array de mensajes al recibir datos inválidos', () => {
    const bad = { name: 123, age: 'not a number' };
    expect(() => pipe.transform(bad, metadata)).toThrow(BadRequestException);

    try {
      pipe.transform(bad, metadata);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      // getResponse() devuelve un objeto { statusCode, message, error }
      const resp = (err as BadRequestException).getResponse() as {
        message: unknown;
        error: string;
        statusCode: number;
      };
      expect(Array.isArray(resp.message)).toBe(true);
      const messages = resp.message as string[];
      expect(messages).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/name must be a string/),
          expect.stringMatching(/age must be an integer number/),
        ]),
      );
    }
  });
});
