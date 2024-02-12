import { NextFunction, Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export type TConfiguration = {
  jwtSecret: string;
  database: {
    type: string;
    host: string;
    port: number;
    username: string;
    database: string;
  };
};

export type TSessionRequest = { user: User };

export type TController = (
  req: Request & Partial<TSessionRequest>,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;

export type TControllerParameters = Parameters<TController>;
