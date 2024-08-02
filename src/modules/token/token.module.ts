import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { Token } from "./entities/token.entity";
import { UserModule } from "../user/user.module";
import { TokenRepository } from "./token.repository";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entity/user.entity";
import { ResetToken } from "../reset-token/entities/reset-token.entity";
import { RsTokenModule } from "../reset-token/RsToken.module";
import { AuthModule } from "src/modules/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Token,User,ResetToken]),
        forwardRef(() => UserModule),
        forwardRef(() => RsTokenModule),
        forwardRef(() => AuthModule)

    ],
    controllers:[TokenController],
    providers: [TokenService,TokenRepository],
    exports:[TokenService,TokenRepository]
})
export class TokenModule {}
