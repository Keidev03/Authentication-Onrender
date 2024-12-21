import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
declare class ErrorMiddleware implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
export { ErrorMiddleware };
