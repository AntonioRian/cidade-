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
        const ResponseClass = this.reflector.get<
          ClassConstructor<any> | ClassConstructor<any>[]
        >('responseClass', context.getHandler());

        if (!ResponseClass || !data) {
          return data;
        }

        // Se ResponseClass é um array, significa que é uma lista
        if (Array.isArray(ResponseClass)) {
          const [ItemClass] = ResponseClass;
          return plainToInstance(ItemClass, data, {
            excludeExtraneousValues: true,
          });
        }

        // Caso contrário, é um objeto único
        return plainToInstance(ResponseClass, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
