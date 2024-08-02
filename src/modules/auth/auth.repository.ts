import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    
}