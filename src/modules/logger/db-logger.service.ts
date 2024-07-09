import { User } from '../../entities/user.entity';

export default class DBLoggerService {
  public model: any;
  constructor(model: any) {
    this.model = model;
  }
  async add(level: string, eventName: string, message: string, data: any) {
    if (!this.model) {
      return;
    }
    try {
      const Entity = this.model;
      const row = new Entity();
      row.level = level;
      row.eventName = eventName;
      row.message = message;
      row.data = JSON.stringify(data);

      const user = await User.findOne({ where: { id: 1 } });
      row.user = user;
      await row.save();
    } catch (error) {
      console.log(error);
    }

    console.log('Insert to db', level, eventName, message, data);
  }
  info(eventName: string, message: string, data: any) {
    this.add('info', eventName, message, data);
  }

  error(eventName: string, message: string, data: any) {
    this.add('error', eventName, message, data);
  }

  warn(eventName: string, message: string, data: any) {
    this.add('warn', eventName, message, data);
  }
}
