import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { UserModule } from './user/user.module';
import { AtGuard, RtGuard } from './common/guards';
import { AtStrategy, RtStrategy } from './strategies';


@Module({
  imports: [
    // CorsModule.forRoot({
    //   origin: 'http://localhost:3003',
    //   credentials: true, // allow credentials cookies, authorization headers
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: 'fircxa',
      }),
      global: true,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Fircxa@18',
      database: 'F2R0C0X5',
      autoLoadEntities: true,
      synchronize:false,
    }),
    UserModule
  ],
  providers: [
    AtStrategy, RtStrategy
  ]
  // config.get('jwtAT.secret'),
 
})
export class AppModule {}
