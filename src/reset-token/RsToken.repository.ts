import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetToken } from "./entities/reset-token.entity";
import { Repository } from "typeorm";

@Injectable()
export class RsTokenRepository {
    constructor( 
        @InjectRepository(ResetToken)
        private readonly tokenRepository: Repository<ResetToken>
    ) {}


        async findOneByUserAndRsToken(userEmail: string, token: string): Promise<ResetToken | undefined> {
            return this.tokenRepository.createQueryBuilder('reset_token')
            .innerJoinAndSelect('reset_token.user', 'user')
            .where('user.email = :userEmail', { userEmail })
            .andWhere('reset_token.token = :token', { token })
            .getOne();
        }

        async deleteTokenById(id: number): Promise<void> {
            await this.tokenRepository.createQueryBuilder('reset_token')
              .delete()
              .where('id = :id', { id })
              .execute();
          }

          async findOneByUserEmail(email: string): Promise<ResetToken | undefined> {
            return this.tokenRepository.createQueryBuilder('reset_token')
              .innerJoinAndSelect('reset_token.user', 'user')
              .where('user.email = :email', { email })
              .getOne();
          }

          async saveRsToken(token: ResetToken): Promise<ResetToken> {
            return this.tokenRepository.save(token);
          }
    

}