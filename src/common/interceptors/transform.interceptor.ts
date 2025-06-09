import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Busca a classe de resposta definida no decorator
        const ResponseClass = this.reflector.get<ClassConstructor<any>>(
          'responseClass',
          context.getHandler(),
        );

        // Se não há classe definida, dados são null/undefined, ou ResponseClass não é válida
        if (!ResponseClass || !data || typeof ResponseClass !== 'function') {
          return data;
        }

        // Aplica a transformação
        return plainToInstance(ResponseClass, data, {
          excludeExtraneousValues: true, // Remove campos não marcados com @Expose()
        });
      }),
    );
  }
}
