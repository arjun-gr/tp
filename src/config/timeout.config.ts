export class TimeoutConfig {
  static EMAIL_INVITE_LINK: number = 2 * 24 * 60 * 60 * 1000;
  static EMAIL_VERIFY_LINK: number = 2 * 24 * 60 * 60 * 1000;
  static FORGOT_PASSWORD_LINK: number = 2 * 24 * 60 * 60 * 1000;
  static ASSESSMENT_DURATION = 12 * 24 * 60 * 60 * 1000;
  static ACCESS_TOKEN_DURATION = 60 * 60 * 24;
  static REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 7;

  static isExpired(date: Date, timeoutConfig: number): boolean {
    return date.getTime() + timeoutConfig < new Date().getTime();
  }
}
