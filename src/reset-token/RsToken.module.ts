import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ResetToken } from "./entities/reset-token.entity";
import { Token } from "src/token/entities/token.entity";
import { User } from "src/user/entity/user.entity";
import { RsTokenController } from "./Rstoken.controller";
import { RsTokenService } from "./RsToken.service";
import { RsTokenRepository } from "./RsToken.repository";
import { UserModule } from "src/user/user.module";
import { TokenModule } from "src/token/token.module";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        TypeOrmModule.forFeature([ResetToken,User,Token]),
        forwardRef(() => TokenModule),
        forwardRef(() => UserModule),

        MailerModule.forRoot({
            transport: {
              host: 'localhost', 
              port: 1025, 
              secure: false,
              auth: null,
              
            },
        
            defaults: {
              from: 'novatori@example.com',
            },
            
          }),
    ],
    controllers:[RsTokenController],
    providers: [RsTokenService,RsTokenRepository,EmailService],
    exports:[RsTokenRepository,RsTokenService,EmailService]
})
export class RsTokenModule {}