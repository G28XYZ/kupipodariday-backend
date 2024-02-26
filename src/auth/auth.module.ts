import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigurationService } from 'src/config';
import { BcryptService } from 'src/helpers/bcrypt.service';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { LocalAuthStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

const jwtFactory = {
  useFactory: async (configService: ConfigurationService) => ({
    secret: configService.get('jwtSecret'),
    signOptions: {
      expiresIn: configService.get('jwtExpire'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    ConfigurationService,
    BcryptService,
    JwtAuthStrategy,
    LocalAuthStrategy,
  ],
})
export class AuthModule {}
