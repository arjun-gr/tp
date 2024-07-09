export default interface AppLoggerInterface {
  info(eventName: string, message: string, data: any): void;

  error(eventName: string, message: string, data: any): void;

  warn(eventName: string, message: string, data: any): void;
}
