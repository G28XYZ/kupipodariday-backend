import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';

import configuration, { ConfigurationService, ormConfig } from './config';
import { JwtService } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, configuration],
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV ?? ''}.env`,
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        process.env.NODE_ENV === 'dev' &&
          new winston.transports.File({
            filename: 'debug.log',
            level: 'info',
          }),
      ],
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    ConfigurationService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
