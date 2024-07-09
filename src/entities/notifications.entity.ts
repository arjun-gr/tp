import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class Notifications extends BaseModelEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'to_user' })
  toUser: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'from_user' })
  fromUser: User;

  // @ManyToOne(() => Clients, (clients) => clients.id, { nullable: true })
  // client: Clients;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'longtext' })
  notification: string;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead: boolean;

  // @Column({ type: 'boolean', name: 'is_view' })
  // isView: boolean;

  @Column({ type: 'longtext', name: 'extra_param', nullable: true })
  extraPram: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;
}
