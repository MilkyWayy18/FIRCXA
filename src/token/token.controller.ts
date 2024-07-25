import { Controller, Get, Injectable, Post, Res, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { PublicRoute } from "src/common/decorators/admin.decorator";
import { RtGuard } from "src/common/guards";
import { GetCurrentUser } from "src/common/decorators";
import { JwtPayloadWithRt } from "src/token/types";
import { Response } from "express";

@Injectable()
@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}


    @PublicRoute()
    @UseGuards(RtGuard)
    @Post('refresh')
    refreshTokens( @GetCurrentUser() user: JwtPayloadWithRt, @Res({ passthrough: true }) res: Response) {
      console.log('Current User:', user.sub); 
      return this.tokenService.refreshTokens(user.sub, user.refreshToken,res);
    }

    @PublicRoute()
    @Get()
    async getAllTokens() {
      return this.tokenService.AllTokens();
    }
  

    
}