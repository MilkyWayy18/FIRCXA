import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";
import * as bcryptjs  from 'bcryptjs';
import { resetPDto } from "./dtos/reset-password.dto";
import { RsTokenRepository } from "./RsToken.repository";
import { v4 } from "uuid";
import { ResetToken } from "./entities/reset-token.entity";
import { EmailService } from "./email.service";



@Injectable()
export class RsTokenService {
    constructor(       
        private readonly userRepository: UserRepository,
        private readonly rsTokenRepository: RsTokenRepository,
        private readonly emailService : EmailService
    ) {}

    
    async forgotPassword(email: string): Promise<String> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
    
        const resetToken = v4();
        const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000); 
    
        let rsTokenEntity = await this.rsTokenRepository.findOneByUserEmail(email)
    
        if (rsTokenEntity) {
          rsTokenEntity.token = resetToken;
          rsTokenEntity.expirationDate = expirationDate;
          await this.rsTokenRepository.saveRsToken(rsTokenEntity);

        } 
        else {
          rsTokenEntity = new ResetToken(); 
          rsTokenEntity.user = user; 
          rsTokenEntity.token = resetToken;
          rsTokenEntity.expirationDate = expirationDate;
          await this.rsTokenRepository.saveRsToken(rsTokenEntity);
        }
    
        await this.emailService.sendResetPasswordEmail(user.email, resetToken);

        return 'send email'
      }

    
    async resetPassword(resetT: string, dto: resetPDto): Promise<string> {
        const user = await this.userRepository.findOneWithRelationRsToken(dto.email);
        
        if (!user) throw new Error(`User with email ${dto.email} not found`);

        const userToken = await this.rsTokenRepository.findOneByUserAndRsToken(dto.email,resetT)
        if (!userToken) throw new UnauthorizedException('User does not have this token!');

        const isExpired = userToken.expirationDate < new Date();
        if (isExpired) throw new ForbiddenException('Token has expired');

        const newPasswordHash = await bcryptjs.hash(dto.newPassword, 10);
        user.hashP = newPasswordHash;
    
        user.resetTokens = user.resetTokens.filter(t => t.token !== resetT);
    
        await this.userRepository.updateUser(user);
    
        await this.rsTokenRepository.deleteTokenById(userToken.id);

        return 'password changed!'
      }

}