import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { UserModule } from './modules/user/user.module';
import { AtStrategy, RtStrategy } from './strategies';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { AdminGuard } from './common/guards/admin.guard';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from './modules/token/token.module';
import { RsTokenModule } from './modules/reset-token/RsToken.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    // CorsModule.forRoot({
    //   origin: 'http://localhost:3003',
    //   credentials: true
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: 'fircxa18',
      }),
      global: true,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      autoLoadEntities: true,
      synchronize:true,
    }),
    UserModule,TokenModule,RsTokenModule,AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    Reflector,
    AtStrategy, RtStrategy
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('*');
  }
}
