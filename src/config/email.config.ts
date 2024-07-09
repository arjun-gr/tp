import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const emailConfig: MailerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get('EMAIL_HOST'),
      port: configService.get('EMAIL_PORT'),
      secure: true,
      // tls: { rejectUnauthorized: false },
      auth: {
        user: configService.get('EMAIL_USERNAME'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    },
    defaults: {
      from: configService.get('EMAIL_SENDER'),
    },
    //Use this to preview emails in browser
    //preview: true,
    template: {
      dir: __dirname + '/../assets/email_templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
    options: {
      partials: {
        dir: __dirname + '/../assets/partials',
        options: {
          strict: true,
        },
      },
    },
  }),
  inject: [ConfigService],
};
