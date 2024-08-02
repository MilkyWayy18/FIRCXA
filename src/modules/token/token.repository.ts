import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "./entities/token.entity";
import { Repository } from "typeorm";

@Injectable()
export class TokenRepository {
    constructor( 
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>
    ) {}


    async findOneByUserAndToken(userId: number, token: string): Promise<Token | undefined> {
        return this.tokenRepository.createQueryBuilder('token')
          .innerJoinAndSelect('token.user', 'user')
          .where('user.id = :userId', { userId })
          .andWhere('token.token = :token', { token })
          .getOne();
      }
    
      async findOneByUserId(userId: number): Promise<Token | undefined> {
        return this.tokenRepository.createQueryBuilder('token')
          .innerJoinAndSelect('token.user', 'user')
          .where('user.id = :userId', { userId })
          .getOne();
      }

      async findOneByUserEmail(email: string): Promise<Token | undefined> {
        return this.tokenRepository.createQueryBuilder('token')
          .innerJoinAndSelect('token.user', 'user')
          .where('user.email = :email', { email })
          .getOne();
      }

      async findOneByUser(user: any): Promise<Token | undefined> {
        return this.tokenRepository.createQueryBuilder('token')
          .where('token.user = :user', { user })
          .getOne();
          
      }

      async findOneByTokenAndUser( userId: number, token: string): Promise<Token | undefined> {
        return this.tokenRepository.createQueryBuilder('token')
          .where('token.token = :token', { token })
          .andWhere('token.userId = :userId', { userId })
          .getOne();
      }
    
    
      async saveToken(token: Token): Promise<Token> {
        return this.tokenRepository.save(token);
      }

      async deleteTokensByUserId(userId: number): Promise<void> {
        await this.tokenRepository.delete({ user: { id: userId } });
      }

      async deleteTokenById(id: number): Promise<void> {
        await this.tokenRepository.createQueryBuilder('token')
          .delete()
          .where('id = :id', { id })
          .execute();
      }

      async getAllTokens(): Promise<Token[]> {
        return this.tokenRepository.find();
      }
}