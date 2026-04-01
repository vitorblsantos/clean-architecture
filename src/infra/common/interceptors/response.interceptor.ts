import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { ApiProperty } from '@nestjs/swagger'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class ResponseFormat<T> {
  data: T
  @ApiProperty()
  duration: string
  @ApiProperty()
  method: string
  @ApiProperty()
  path: string
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const now = Date.now()
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<FastifyRequest>()

    return next.handle().pipe(
      map((data) => ({
        data,
        duration: `${Date.now() - now}ms`,
        method: request.method,
        path: request.url,
      })),
    )
  }
}
