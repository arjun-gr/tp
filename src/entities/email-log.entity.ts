import { Column, Entity } from 'typeorm';
import BaseModelEntity from './base-model.entity';

@Entity({ name: 'email-log' })
export class EmailLog extends BaseModelEntity {
  @Column()
  status: boolean;

  @Column({
    type: 'text',
  })
  sender: string;

  @Column({
    type: 'text',
  })
  receiver: string;

  @Column({
    name: 'errorLog',
    type: 'text',
    nullable: true,
  })
  error_log: string;

  @Column({
    name: 'message',
    type: 'text',
  })
  message: string;

  constructor(
    status: boolean,
    sender: string,
    receiver: string,
    message: string,
    errorLog = null,
  ) {
    super();
    this.status = status;
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.error_log = errorLog;
  }
}
