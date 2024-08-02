import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { UserModule } from "../user/user.module";
import { TokenModule } from "../token/token.module";
import { RsTokenModule } from "../reset-token/RsToken.module";
import { Token } from "../token/entities/token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User,Token]),
    forwardRef(() => TokenModule),
    forwardRef(() => RsTokenModule),
    forwardRef(() => UserModule),
    ],
    providers:[AuthService,AuthRepository],
    controllers: [AuthController],
    exports: [AuthRepository,AuthService]

})

export class AuthModule {}