import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const RESPONSE_CLASS_KEY = 'responseClass';
export const ResponseClass = (cls: ClassConstructor<any>) =>
  SetMetadata(RESPONSE_CLASS_KEY, cls);
