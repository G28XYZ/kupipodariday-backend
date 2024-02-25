import { NextFunction, Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export type TConfiguration = {
  jwtSecret: string;
  jwtExpire: string;
};

export type TSessionRequest = { user: User };

export type TController = (
  req: Request & Partial<TSessionRequest>,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;

export type TControllerParameters = Parameters<TController>;

export type TRequest = Parameters<TController>[0];

export type TResponse = Parameters<TController>[1];

export type TNext = Parameters<TController>[2];

export type ConstructorType<T = any> = new (...args: any[]) => T;
