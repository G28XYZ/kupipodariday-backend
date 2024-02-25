import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TRequest, TSessionRequest } from 'src/types';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetReqParam = <
  P extends keyof TSessionRequest,
  F extends keyof TSessionRequest[P],
>(
  param: P,
  field?: F,
) => {
  const paramDecorator = createParamDecorator<TSessionRequest>(
    (_, context: ExecutionContext) => {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext<{ req: TRequest }>().req;

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
