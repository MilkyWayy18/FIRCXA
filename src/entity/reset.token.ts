// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// import { User } from './user.entity';

// @Entity()
// export class ResetToken {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   token: string;

//   @ManyToOne(() => User, user => user.resetTokens)
//   user: User;

//   @CreateDateColumn({ type: 'timestamp' })
//   createdAt: Date;
// }