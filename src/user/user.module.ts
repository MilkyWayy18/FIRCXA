import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { EmailService } from '../reset-token/email.service';
import { UserRepository } from './user.repository';
import { TokenModule } from 'src/token/token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetToken } from 'src/reset-token/entities/reset-token.entity';
import { RsTokenModule } from 'src/reset-token/RsToken.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([User,Token,ResetToken]),
    
    forwardRef(() => TokenModule),
    forwardRef(() => RsTokenModule),


  ],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports:[UserRepository]
})
export class UserModule {}
