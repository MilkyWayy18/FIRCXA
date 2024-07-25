import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { Token } from "./entities/token.entity";
import { UserModule } from "src/user/user.module";
import { TokenRepository } from "./token.repository";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entity/user.entity";
import { ResetToken } from "src/reset-token/entities/reset-token.entity";
import { RsTokenModule } from "src/reset-token/RsToken.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Token,User,ResetToken]),
        forwardRef(() => UserModule),
        forwardRef(() => RsTokenModule)

    ],
    controllers:[TokenController],
    providers: [TokenService,TokenRepository],
    exports:[TokenService,TokenRepository]
})
export class TokenModule {}
