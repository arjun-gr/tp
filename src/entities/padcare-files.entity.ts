import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { BranchProduct } from './branch-products.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { File } from './file.entity';
import { Purchase } from './purchase.entity';
import { ServiceProduct } from './service-product.entity';
import { Services } from './services.entity';
import { User } from './user.entity';

@Entity({ name: 'padcare_files' })
export class PadcareFiles extends BaseModelEntity {
  // @Column({ type: 'int' })
  // entityId: number;

  // @Column({ type: 'varchar', length: 50 })
  // entityType: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  fileId: File;

  @Column({ type: 'varchar', length: 50 })
  fileType: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Clients, (client) => client.id, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @ManyToOne(() => City, (city) => city.id, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Branch, (branch) => branch.id, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Purchase, (purchase) => purchase.id, { nullable: true })
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @ManyToOne(() => Services, (service) => service.id, { nullable: true })
  @JoinColumn()
  service: Services;

  @ManyToOne(() => BranchProduct, (branchProduct) => branchProduct.id, {
    nullable: true,
  })
  @JoinColumn()
  branchProduct: BranchProduct;

  @ManyToOne(() => ServiceProduct, (serviceProduct) => serviceProduct.id, {
    nullable: true,
  })
  @JoinColumn()
  serviceProduct: ServiceProduct;
}
