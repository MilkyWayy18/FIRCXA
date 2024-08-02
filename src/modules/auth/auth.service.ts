import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto,ChangePDto } from "../user/dto";
import { UserRepository } from "../user/user.repository";
import * as bcryptjs from 'bcryptjs'
import { TokenService } from "../token/token.service";
import { Response } from "express";
import * as session from 'express-session';


@Injectable()
export class AuthService {
    constructor( 
        private readonly userRepository : UserRepository,
        private readonly tokenService : TokenService
    ) {}
            
    async signinLocal(dto: AuthDto,  res:Response){
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) throw new ForbiddenException('access denied');

        const passwordMatches = await bcryptjs.compare(dto.password,user.hashP);
        if (!passwordMatches) throw new ForbiddenException('access denied');

        const refreshTokenExpiresIn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); 

        const tokens = await this.tokenService.getTokens(user.id, user.email);
        await this.tokenService.saveToken(user.id, tokens.refresh_token,refreshTokenExpiresIn);


        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            expires: refreshTokenExpiresIn,
        });
        res.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: true,
            expires: refreshTokenExpiresIn,
        });

        // res.req.session.user = {
        //   id: user.id,
        //   email: user.email,
        //   role: user.role,
        // };

        return { access_token: tokens.access_token, role: user.role };
    }

        
      async logout(userId: number, res:Response): Promise<boolean> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
          throw new Error(`user with id${userId} not found`);
        }

        user.hashedRt = null; 
  
        await this.userRepository.updateUser(user);

        res.clearCookie('refresh_token');
        return true;
  
        
      }

      
      async changePassword( userId:number, dto:ChangePDto ): Promise<boolean>{
        const user = await this.userRepository.findById(userId);
        if (!user) throw new ForbiddenException('access denied');

        const matchPassword = await bcryptjs.compare(dto.oldPassword, user.hashP)
        if(!matchPassword) throw new ForbiddenException('password is incorrect')

        const newPassword = await bcryptjs.hash(dto.newPassword,10)
        user.hashP = newPassword

        await this.userRepository.updateUser(user)

        return true 
      }

}
