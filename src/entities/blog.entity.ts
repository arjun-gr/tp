import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity({ name: 'blog' })
export class Blog extends BaseModelEntity {
  @Column({ type: 'varchar' })
  title: string;

  @OneToOne(() => File, { nullable: false })
  @JoinColumn({})
  heroImage: File;

  @OneToOne(() => File, { nullable: false })
  @JoinColumn({})
  teaserImage: File;

  @Column({ type: 'longtext', collation: 'utf8mb4_unicode_520_ci' })
  content: string;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  @ApiProperty({ example: '2024-01-01 14:56:33' })
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'published_by' })
  publishedBy: User;

  @Column({ type: Boolean, default: false, name: 'is_feature' })
  isFeature!: boolean;
}
