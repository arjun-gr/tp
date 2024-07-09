import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ default: true, type: Boolean, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  updatedAt: Date;

  // Add this column to your entity!
  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  deletedAt?: Date;
}
