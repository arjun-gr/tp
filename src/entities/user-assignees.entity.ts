import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_assignees')
export class UserAssignee {
  @PrimaryColumn({ name: 'city_manager_id' })
  cityManagerId: number;

  @PrimaryColumn({ name: 'executive_id' })
  executiveId: number;

  @ManyToOne(() => User, (user: any) => user.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'city_manager_id', referencedColumnName: 'id' }])
  cityManagerIds: User[];

  @ManyToOne(() => User, (user: any) => user.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'executive_id', referencedColumnName: 'id' }])
  executiveIds: User[];
}
