import { ForbiddenException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs  from 'bcryptjs';
import { ChangePDto, CreateDto, resetPDto, AuthDto } from 'src/user/dto';
import { EmailService } from '../reset-token/email.service';
import { Response } from 'express';
import { UserRepository } from './user.repository';
import { TokenRepository } from 'src/token/token.repository';
import { TokenService } from 'src/token/token.service';
import { User } from './entity/user.entity';
import { RsTokenRepository } from 'src/reset-token/RsToken.repository';

@Injectable()
export class UserService {
  constructor(
        private tokenService : TokenService,
        private readonly userRepository : UserRepository,

    ) {}
    async signupLocal(dto: CreateDto, res:Response){

        const user = await this.userRepository.createUser(dto)

        console.log(user)

        const tokens = await this.tokenService.getTokens(user.id, user.email);

        // const accessTokenExpiresIn = new Date(Date.now() + 15 * 60 * 1000); 
        const refreshTokenExpiresIn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); 

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
        return { access_token: tokens.access_token };
    }

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

      GetAll() {
        return this.userRepository.getAllUsers();
      }

      async getUserById(id: number): Promise<User> {
        return this.userRepository.findById(id);
      }

      async deleteUser(id: number): Promise<void> {
        await this.userRepository.softDeleteUser(id);
      }
      

      
}


