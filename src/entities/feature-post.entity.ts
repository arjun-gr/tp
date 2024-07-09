import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity({ name: 'post' })
export class FeaturePost extends BaseModelEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({})
  thumbnail: File;

  @Column({ type: Boolean, default: false, name: 'is_feature' })
  isFeature!: boolean;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'published_by' })
  publishedBy: User;
}
