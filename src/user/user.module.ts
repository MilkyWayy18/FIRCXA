import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Token } from 'src/entity/token.entity';
import { EmailService } from './email.service';
// import { ResetToken } from 'src/entity/reset.token';

@Module({

  imports: [
    TypeOrmModule.forFeature([User,Token]),
  //   JwtModule.register({
  //     secret: '', 
  //     signOptions: { expiresIn: '1d' } 
  // })
  ],
  controllers: [UserController],
  providers: [UserService,EmailService]
})
export class UserModule {}
