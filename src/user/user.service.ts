import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs  from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/jwtPayload.type';
import { Tokens } from 'src/types/tokens.type';
import { ChangePDto, CreateDto, resetPDto, AuthDto } from 'src/dto';
import { JwtPayloadWithRt } from 'src/types';
import { Token } from 'src/entity/token.entity';
import { EmailService } from './email.service';
import { v4 } from 'uuid';


@Injectable()
export class UserService {

  constructor(
        @InjectRepository(User) 
        protected readonly userRepo : Repository<User>,
        @InjectRepository(Token)
        protected readonly tokenRepo : Repository<Token>,
        private jwtService: JwtService,
        private config: ConfigService,
        private readonly emailService: EmailService

    ) {}
    async signupLocal(dto: CreateDto) {
        const hashP = await bcryptjs.hash(dto.password,10);
        const hashedRt= ''
        const user = await this.userRepo
            .save({
                first_name:dto.first_name,
                email: dto.email,
                hashP,
                hashedRt
            })
        const tokens = await this.getTokens(user.id, user.email);
        await this.saveToken(user.id, tokens.refresh_token);    
        return tokens;
    }

    async signinLocal(dto: AuthDto){
        const user = await this.userRepo.findOne({
          where: {
            email: dto.email,
          },
        });

        if (!user) throw new ForbiddenException('access denied');
    
        const passwordMatches = await bcryptjs.compare(dto.password,user.hashP);
        if (!passwordMatches) throw new ForbiddenException('invalid password');
    
        const tokens = await this.getTokens(user.id, user.email);
        await this.saveToken(user.id, tokens.refresh_token);
    
        return tokens;
      }
    
      async logout(userId: number): Promise<boolean> {
        const user = await this.userRepo.findOneBy({id:userId});

        if (!user) {
          throw new Error(`User with id ${userId} not found`);
        }

        user.hashedRt = null; 
  
        await this.userRepo.save(user);
  
        return true;
      }

      async changePassword( userId:number, dto:ChangePDto ): Promise<boolean>{
        const user = await this.userRepo.findOneBy({id:userId});
        if (!user) throw new ForbiddenException('access denied');

        const matchPassword = await bcryptjs.compare(dto.oldPassword, user.hashP)
        if(!matchPassword) throw new ForbiddenException('password is incorrect')

        const newPassword = await bcryptjs.hash(dto.newPassword,10)
        user.hashP = newPassword

        await this.userRepo.save(user)

        return true 
      }

      async resetPassword(userId: number,rt: string, dto: resetPDto): Promise<string> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['tokens'],
        });
        
        if (!user) throw new Error(`User with id ${userId} not found`);
        const userToken = user.tokens.find(t => t.token === rt);

        if (!userToken) throw new UnauthorizedException('Token not found');

        const isExpired = userToken.expirationDate < new Date();
        if (isExpired) throw new ForbiddenException('Token has expired');

        const newPasswordHash = await bcryptjs.hash(dto.newPassword, 10);
        user.hashP = newPasswordHash;
    
        user.tokens = user.tokens.filter(t => t.token !== rt);
    
        await this.userRepo.save(user);
    
        await this.tokenRepo.delete(userToken.id);

        return 'password changed!'
      }

      async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
    
        const refreshToken = v4();
        const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000); 
    
        let tokenEntity = await this.tokenRepo.findOne({ where: { user } });
    
        tokenEntity.token = refreshToken;
        tokenEntity.expirationDate = expirationDate;
    
        await this.tokenRepo.save(tokenEntity);
    
        await this.emailService.sendResetPasswordEmail(user.email, refreshToken);
      }
    
      
      async refreshTokens(userId: number, rt: string): Promise<Tokens> {

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.hashedRt) throw new ForbiddenException('access Denied!!!');
    
        const tokenEntity = await this.tokenRepo.findOne({ where: { user: { id: userId }, token: rt } });
        if (!tokenEntity) throw new ForbiddenException('access Denied!!!');
    
        const hashedTokenId = tokenEntity.id.toString();
        const rtMatches = await bcryptjs.compare(hashedTokenId, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Token does not match!');

        const isExpired = tokenEntity.expirationDate < new Date();
        if (isExpired) {
            throw new ForbiddenException('token has expired!');
        }
    
        const tokens = await this.getTokens(user.id, user.email);
        await this.saveToken(user.id, tokens.refresh_token);
    
        return tokens;

      }

      async saveToken(userId: number, token: string) {
        let tokenEntity = await this.tokenRepo.findOne({ where: { user: { id: userId } } });
    
        if (!tokenEntity) {
          tokenEntity = new Token();
          tokenEntity.user = await this.userRepo.findOne({where:{id:userId}});
        }
    
        tokenEntity.token = token;
    
        await this.tokenRepo.save(tokenEntity);
    
        await this.updateRtHash(userId, tokenEntity.id);

      }
    
      async updateRtHash(userId: number, tokenId: number): Promise<void> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
    
        if (!user) {
          throw new Error('User not found');
        }
    
        const hashedRT = await bcryptjs.hash(tokenId.toString(), 10);
        user.hashedRt = hashedRT;
    
        await this.userRepo.save(user);

      }
      async getTokens(userId: number, email: string){
        const jwtPayload: JwtPayload = {
          sub: userId,
          email: email,
        };
    
        const [at, rt] = await Promise.all([
          this.jwtService.signAsync(jwtPayload),
          this.jwtService.signAsync(jwtPayload),
        ]);
    
        return {
          access_token: at,
          refresh_token: rt,
        };
      }
}
function uuidv4() {
  throw new Error('Function not implemented.');
}

