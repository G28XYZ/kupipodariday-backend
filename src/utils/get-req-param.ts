import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TRequest, TSessionRequest } from 'src/types';

export const GetReqParam = <
  P extends keyof TSessionRequest,
  F extends keyof TSessionRequest[P],
>(
  param: P,
  field?: F,
) => {
  const paramDecorator = createParamDecorator<TSessionRequest>(
    (
      _,
      ctx: ExecutionContext,
    ): TSessionRequest[P] | TSessionRequest[P][F] | null => {
      const request = ctx.switchToHttp().getRequest<TRequest>();

      if (!request?.[param]) {
        return null;
      }

      if (field) {
        return request?.[param]?.[field];
      }

      return request?.[param];
    },
  );
  return paramDecorator();
};
