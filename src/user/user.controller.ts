import { Body, Controller, Injectable, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto,CreateDto,ChangePDto,resetPDto } from 'src/dto';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { RtGuard,AtGuard } from 'src/common/guards';
import { JwtPayloadWithRt } from 'src/types';
import { forgotPDto } from 'src/dto/forgotPassword.dto';


@Injectable()
@Controller('api')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    signUp(@Body() dto:CreateDto) {
      return this.userService.signupLocal(dto) 
    }
    
    @Post('login')
    login(@Body() dto:AuthDto) {
        return this.userService.signinLocal(dto)
    }

    @UseGuards(AtGuard)
    @Post('logout')
    logout(@GetCurrentUserId() userId: number): Promise<boolean> {
      //console.log(userId)
      return this.userService.logout(userId);
    }

    @UseGuards(AtGuard)
    @Put('change-password')
    changePassword(@GetCurrentUserId() userId: number, @Body() dto:ChangePDto){
      return this.userService.changePassword(userId,dto)
    }

    @UseGuards(RtGuard)
    @Put('reset-password')
    resetPassword(@GetCurrentUser() user:  JwtPayloadWithRt, @Body() dto:resetPDto){
      return this.userService.resetPassword(user.sub ,user.refreshToken,dto)

    }

    @Post('forgot-password')
    forgotPasswrod(@Body() dto:forgotPDto){
      return this.userService.forgotPassword(dto.email)
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    refreshTokens(
      // @GetCurrentUserId() userId: number,
      @GetCurrentUser() user: JwtPayloadWithRt,
    ) {
      // console.log('Current User:', user.sub); 
      // console.log('Refresh Token:', user.refreshToken); 
    
      return this.userService.refreshTokens(user.sub, user.refreshToken);
    }


}
