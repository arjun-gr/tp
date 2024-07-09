import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { User } from './user.entity';

@Entity({ name: 'employee-profile' })
export class EmployeeProfile extends BaseModelEntity {
  @OneToOne(() => User, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'nvarchar', length: 50 })
  type: string;

  // @Column({ type: 'int', default: 0, name: 'profile_pic_id' })
  // profilePicId: number;

  @Column({ type: 'nvarchar', length: 50, name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  designation: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  division: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  jobType: string;
}
