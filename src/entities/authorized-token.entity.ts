import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'authorized-token' })
export class AuthorizedToken {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  updatedAt: Date;

  @Column()
  refreshTokenHash: string;

  @Column()
  accessTokenHash: string;

  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
