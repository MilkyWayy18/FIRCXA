import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ type: 'timestamp', nullable: true })
    expirationDate: Date;

    @ManyToOne(() => User, user => user.tokens)
    @JoinColumn()
    user: User;

    @BeforeInsert()
    setDefaultExpirationDate() {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      this.expirationDate = currentDate;
    }
}