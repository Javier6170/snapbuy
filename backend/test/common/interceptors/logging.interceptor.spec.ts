import type { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

import { LoggingInterceptor } from '../../../src/common/interceptors/logging.interceptor';
;

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockLoggerLog: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    // Spy on the private logger instance
    mockLoggerLog = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log request and response with timing', (done) => {
    // Prepare a fake HTTP context
    const mockRequest = { method: 'GET', url: '/test' } as never;
    const mockHttp = {
      getRequest: () => mockRequest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getResponse: () => ({} as any),
    };
    const mockContext = {
      switchToHttp: () => mockHttp,
    } as unknown as ExecutionContext;

    // Mock the next handler to return a simple observable
    const next: CallHandler = {
      handle: () => of('ok'),
    };

    // Invoke interceptor
    const result$ = interceptor.intercept(mockContext, next);

    result$.subscribe({
      next: () => {
        // First call: Request log
        expect(mockLoggerLog).toHaveBeenCalledWith('Request: GET /test');
        // Second call: Response log with timing
        const secondArg = mockLoggerLog.mock.calls[1][0] as string;
        expect(secondArg).toMatch(/^Response: GET \/test - \d+ms$/);
        done();
      },
      error: done.fail,
    });
  });
});