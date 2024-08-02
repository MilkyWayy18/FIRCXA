import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Token } from '../../token/entities/token.entity';
  import { ResetToken } from '../../reset-token/entities/reset-token.entity';
  import { UserRole } from '../../token/types/role.type';
  


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
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

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @DeleteDateColumn()
    deleted_at : Date

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => ResetToken,RsToken => RsToken.user)
    resetTokens: ResetToken[]



}