import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { City } from './city.entity';
import { User } from './user.entity';

@Entity('user_city')
export class UserCity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'city_id' })
  cityId: number;

  @ManyToOne(() => User, (user: any) => user.city, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: User[];

  @ManyToOne(() => City, (city: any) => city.user, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'city_id', referencedColumnName: 'id' }])
  cities: City[];
}
