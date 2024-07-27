/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const body = request.body !== undefined ? request.body: null

        const res = {
            statusCode: status,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
            body
        }
        
        response //? renvoie des erreurs dans Express
            .status(status)
            .json(res);
    }
}