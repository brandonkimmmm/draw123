import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AnonymousStrategy } from './anonymous/anonymous.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT.SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT.EXPIRES_IN')
                }
            })
        }),
        PassportModule,
        UserModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, AnonymousStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
