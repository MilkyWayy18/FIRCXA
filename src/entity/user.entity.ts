import { Options } from "@nestjs/common";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Token } from "./token.entity";


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

    @Column({ nullable: true })
    hashedRt:string

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @Column({ nullable: true })
    resetToken: string;

    @Column({ nullable: true, type: 'timestamp' })
    resetTokenExpiration: Date;

    // @OneToMany(() => ResetToken, resetToken => resetToken.user)
    // resetTokens: ResetToken[];

}