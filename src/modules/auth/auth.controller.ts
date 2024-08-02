import { Body, Controller, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PublicRoute } from "src/common/decorators/admin.decorator";
import { AuthDto,ChangePDto } from "../user/dto";
import { GetCurrentUserId } from "src/common/decorators";
import { Response } from "express";
import { AtGuard } from "src/common/guards";
import { CustomBody } from "src/common/decorators/body.decorator";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @PublicRoute()
    @Post('login')
    login(@CustomBody() dto:AuthDto, @Res({ passthrough: true }) res: Response,@Req() req: Request) {
        return this.authService.signinLocal(dto,res)
    }

    @PublicRoute()
    @UseGuards(AtGuard)
    @Post('logout')  
    logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: Response): Promise<boolean> {
      console.log(userId)
      return this.authService.logout(userId,res);
    }

    @PublicRoute()
    @UseGuards(AtGuard)
    @Put('change-password')
    changePassword(@GetCurrentUserId() userId: number, @Body() dto:ChangePDto, @Res({ passthrough: true }) res: Response){
      return this.authService.changePassword(userId,dto)
    }
}
