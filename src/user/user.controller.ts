import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto,CreateDto,ChangePDto,resetPDto } from 'src/user/dto';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { RtGuard,AtGuard } from 'src/common/guards';
import { JwtPayloadWithRt } from 'src/token/types';
import { forgotPDto } from 'src/user/dto/forgotPassword.dto';
import { Response } from 'express';
import { PublicRoute } from 'src/common/decorators/admin.decorator';
import { User } from './entity/user.entity';

@Injectable()
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @PublicRoute()
    @Post('signup')
    signUp(@Body() dto:CreateDto, @Res({ passthrough: true }) res: Response) {
      return this.userService.signupLocal(dto,res) 
    }
    
    @PublicRoute()
    @Post('login')
    login(@Body() dto:AuthDto, @Res({ passthrough: true }) res: Response) {
        return this.userService.signinLocal(dto,res)
    }

    @PublicRoute()
    @UseGuards(AtGuard)
    @Post('logout')  
    logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: Response): Promise<boolean> {
      console.log(userId)
      return this.userService.logout(userId,res);
    }

    @PublicRoute()
    @UseGuards(AtGuard)
    @Put('change-password')
    changePassword(@GetCurrentUserId() userId: number, @Body() dto:ChangePDto, @Res({ passthrough: true }) res: Response){
      return this.userService.changePassword(userId,dto)
    }

    @PublicRoute()
    @Get(':id')
    async getUser(@Param('id') id: number): Promise<User> {
      const user = await this.userService.getUserById(id);
      return user;
    }

    @PublicRoute()
    @Get()
    async GetAll(): Promise<User[]> {
      return await this.userService.GetAll();
    }

    @PublicRoute()
    @Delete()
    DeleteUser(@GetCurrentUserId() userId : number) {
      return this.userService.deleteUser(userId)
    }

}
