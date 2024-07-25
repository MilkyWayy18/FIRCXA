import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Token } from "src/token/entities/token.entity";
import { ResetToken } from "src/reset-token/entities/reset-token.entity";
import { UserRole } from "src/token/types/role.type";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column({ unique:true })
    email: string;

    @Column()
    hashP: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.user
    })
    role: UserRole

    @Column({ nullable: true })
    hashedRt:string

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => ResetToken,RsToken => RsToken.user)
    resetTokens: ResetToken[]



}