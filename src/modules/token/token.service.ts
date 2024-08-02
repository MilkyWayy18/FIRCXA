import { ForbiddenException, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload,JwtPayloadWithRt } from "./types";
import * as bcryptjs  from 'bcryptjs';
import { UserRepository } from "../user/user.repository";
import { Token } from "./entities/token.entity";
import { TokenRepository } from "./token.repository";
import { Response } from "express";
import { UserRole } from "./types/role.type";

@Injectable()
export class TokenService {
    constructor(  
        private jwtService : JwtService,
        private userRepository: UserRepository,
        private tokenRepository : TokenRepository
    ) {}

    async refreshTokens(userId: number, rt: string, @Res() res:Response){

        const user = await this.userRepository.findById(userId);
        if (!user || !user.hashedRt) throw new ForbiddenException('user not found, access Denied!!!');
    
        const tokenEntity = await this.tokenRepository.findOneByUserAndToken(userId,rt);
        if (!tokenEntity) throw new ForbiddenException('user does not  have this token');
    
        const hashedTokenId = tokenEntity.id.toString();
        const rtMatches = await bcryptjs.compare(hashedTokenId, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Token does not match!');

        const isExpired = tokenEntity.expirationDate < new Date();
        if (isExpired) {
            throw new ForbiddenException('token has expired!');
            
        }

        // const accessTokenExpiresIn = new Date(Date.now() + 15 * 60 * 1000); 
        const refreshTokenExpiresIn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); 
    
        const tokens = await this.getTokens(user.id, user.email);
        await this.saveToken(user.id, tokens.refresh_token,refreshTokenExpiresIn);
    
        res.cookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
          secure: true,
        });

        res.cookie('access_token', tokens.access_token, {
          httpOnly: true,
          secure: true,
        });


        return { access_token: tokens.access_token };    
    }


    async saveToken(userId: number, token: string, expires:Date) {
        let tokenEntity = await this.tokenRepository.findOneByUserId(userId);
    
        if (!tokenEntity) {
          tokenEntity = new Token();
          tokenEntity.user = await this.userRepository.findById(userId);
        }
    
        tokenEntity.token = token;
        tokenEntity.expirationDate = expires;

    
        await this.tokenRepository.saveToken(tokenEntity);
    
        await this.updateRtHash(userId, tokenEntity.id);

      }


      async updateRtHash(userId: number, tokenId: number): Promise<void> {
        const user = await this.userRepository.findById(userId);
    
        if (!user) {
          throw new Error('User not found');
        }
    
        const hashedRT = await bcryptjs.hash(tokenId.toString(), 10);
        user.hashedRt = hashedRT;
    
        await this.userRepository.updateUser(user);

      }
     

    async getTokens(userId: number, email: string){

      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

        const jwtPayload: JwtPayload = {
          sub: userId,
          email: email,
          role: user.role
          
        };
        console.log(user.role)
        const JwtPayloadWithRt: JwtPayloadWithRt = {
          sub: userId,
          email: email,
          refreshToken: ''
        };
    
        const [at, rt] = await Promise.all([
          this.jwtService.signAsync(jwtPayload, { expiresIn: '15m' }),
          this.jwtService.signAsync(jwtPayload, { expiresIn: '2w' }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }   

    async AllTokens(){
      return this.tokenRepository.getAllTokens()
    }
    
}