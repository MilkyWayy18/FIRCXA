import { ForbiddenException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs  from 'bcryptjs';
import { CreateDto } from './dto';
import { Response } from 'express';
import { UserRepository } from './user.repository';
import { TokenService } from '../token/token.service';
import { User } from './entity/user.entity';
import { TokenRepository } from '../token/token.repository';

@Injectable()
export class UserService {
  constructor(
        private tokenService : TokenService,
        private readonly userRepository : UserRepository,
        private tokenRepository : TokenRepository

    ) {}
    async signupLocal(dto: CreateDto, res:Response){

        const checkEmail = await this.userRepository.findByEmail(dto.email)

        if(checkEmail) throw new ForbiddenException('email is already used')

        const user = await this.userRepository.createUser(dto)

        console.log(user)

        const tokens = await this.tokenService.getTokens(user.id, user.email);

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

      GetAll() {
        return this.userRepository.getAllUsers();
      }

      async getUserById(id: number): Promise<User> {
        return this.userRepository.findById(id);
      }

      async deleteUser(id: number): Promise<void> {
        const user  = await this.userRepository.findById(id)
        if(!user) throw new UnauthorizedException(`user wiht id ${id} not found`)
        await this.tokenRepository.deleteTokensByUserId(id)
        await this.userRepository.softDeleteUser(id);
      }
      

      
}


