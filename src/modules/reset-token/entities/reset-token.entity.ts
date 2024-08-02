import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.resetTokens, )
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}