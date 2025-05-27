// src/common/filters/http-exception.filter.spec.ts

import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';



describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { url: string };
  let mockHost: ArgumentsHost;
  let spyLoggerError: jest.SpyInstance;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = { url: '/test-path' };

    // Build a minimal ArgumentsHost stub
    const stub = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
      // unused but required by the type
      getArgs: () => [],
      getArgByIndex: (_: number) => undefined,
      switchToRpc: () => ({ getContext: () => undefined }),
      switchToWs: () => ({ getClient: () => undefined, getData: () => undefined }),
    };

    mockHost = stub as unknown as ArgumentsHost;

    spyLoggerError = jest.spyOn(
      // access the private logger
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filter as any).logger,
      'error',
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg).toMatchObject({
      path: mockRequest.url,
      error: 'Not Found',
    });
    expect(typeof jsonArg.timestamp).toBe('string');
    expect(spyLoggerError).toHaveBeenCalledWith(
      `Status ${HttpStatus.NOT_FOUND} Error: "Not Found"`,
    );
  });

  it('should handle non-HttpException as 500', () => {
    const exception = new Error('Something went wrong');
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg).toMatchObject({
      path: mockRequest.url,
      error: { message: 'Internal server error' },
    });
    expect(spyLoggerError).toHaveBeenCalledWith(
      `Status ${HttpStatus.INTERNAL_SERVER_ERROR} Error: ${JSON.stringify({ message: 'Internal server error' })}`,
    );
  });
});
