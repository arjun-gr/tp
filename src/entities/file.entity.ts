import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Ticket } from './ticket.entity';

export enum DISK {
  LOCAL = 'local',
  S3 = 's3',
}

@Entity({ name: 'file' })
export class File extends BaseModelEntity {
  @Column({
    type: 'varchar',
    name: 'original_name',
    length: 255,
    comment: 'Original file name from the client',
  })
  originalName: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'System generated filename',
  })
  name: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({
    type: 'enum',
    enum: DISK,
    default: DISK.LOCAL,
    comment: 'The disk used for uploading the file',
  })
  disk: string;

  @Column({
    type: 'varchar',
    comment: 'The url of the file',
    length: 1000,
  })
  url: string;

  @Column({ type: 'varchar', name: 'mime_type', length: 255 })
  mimetype: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.images, { nullable: true })
  @JoinColumn({ name: 'ticket' })
  ticket: Ticket;
}
