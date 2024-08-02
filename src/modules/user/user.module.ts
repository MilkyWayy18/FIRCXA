import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Token } from '../token/entities/token.entity';
import { EmailService } from '../reset-token/email.service';
import { UserRepository } from './user.repository';
import { TokenModule } from '../token/token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetToken } from '../reset-token/entities/reset-token.entity';
import { RsTokenModule } from '../reset-token/RsToken.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([User,Token,ResetToken]),
    
    forwardRef(() => TokenModule),
    forwardRef(() => RsTokenModule),
    forwardRef(() => AuthModule),

  ],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports:[UserRepository,UserService]
})
export class UserModule {}
