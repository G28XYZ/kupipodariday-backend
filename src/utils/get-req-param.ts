import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ConstructorType, TRequest, TSessionRequest } from 'src/types';

export const GetReqParam = <
  T extends ConstructorType,
  K extends keyof InstanceType<T>,
>(
  param: keyof TSessionRequest,
  field?: K,
) => {
  const paramDecorator = createParamDecorator(
    (data = field, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<TRequest>();

      if (!request?.[param]) {
        return null;
      }

      if (data) {
        return request?.[param]?.[data];
      }

      return request?.[param];
    },
  );
  return paramDecorator();
};
