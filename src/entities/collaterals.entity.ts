import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity({ name: 'collaterals' })
export class Collaterals extends BaseModelEntity {
  @OneToOne(() => File, { nullable: false })
  @JoinColumn({})
  collateralFile: File;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: Boolean, default: false, name: 'is_feature' })
  isFeature!: boolean;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'published_by' })
  publishedBy: User;
}
