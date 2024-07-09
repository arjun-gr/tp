import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  static build(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription(
        `Welcome to the documentation for the APIs that are built for the Padcare application.
         The APIs for each module are grouped by the module name.`,
      )
      .setVersion('0.1')
      .addBearerAuth(undefined, 'defaultBearerAuth')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const options = {
      swaggerOptions: {
        authAction: {
          defaultBearerAuth: {
            name: 'defaultBearerAuth',
            schema: {
              description: 'Default',
              type: 'http',
              in: 'header',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            value:
              'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaGlzaC5iYWhldGlAZm9jYWx3b3Jrcy5pbiIsInN1YiI6MSwicm9sZSI6ImFkbWluLHN1cGVyX2FkbWluIiwiaWF0IjoxNjgxODgzODg3LCJleHAiOjE2ODE5NzAyODd9.fzx_P0X8m50dwcZSGaDATq_OEZZT0eQxtsUe47tnbfArEymbNsAHK43ngfbvzkAIk7FeZHsGDGI13DkJeR9Tno-3G8T_rCJKl6XsXelk7RB_zxxpsnSmARYa9VUUryAh_Kz3op8iiYtxeGXlNavV4fOwQkg31Dh1cg_jnf6cYqO9cOAPUiZKAui9uDUxHQ4J99L6pj3oS0UlflS5XEHa5_Feh3fQjdIyWeDN1dAXIgjKMczBc6sF4pQ9zuZJKpzCU1OON48wV7NRjorrX7PZCIIwLdulbVxuGvkb65en22YwJ3-ey0wi_ye8e6M6hpTGS_z9zv1jRZhagWImLy_u-_XrWrvjPB3hJmItIt2lH26LI3yFIowNr1wTSlLeOrX-S7g2z0E7Ql8DCmWVUETQojZvo-Cdt0nUzr1qbzw2HVSfAFopH_m1sag1Qni_XAKvvw9bI39kBi4ivAdbl1U28Tj3QV3fqYhYMZarm8DhNtqLuHbGgqGbWGBkFO43KvPXQ1bUUr6pYneJG9NZOPcKGqcqaIo_DDRPcnbVALwh4st-PAXuFJwU09O6O9w1Os7kYlkk_Pikbm58x4E9HHO-UHIQ4Z4nNWPD9ZpE6pLbxOS98SF3xgPzThiZFPujkjQBwNLT2xYrPDVctUXEjcXmc4NnvWEMHmK_DXA56rkQhzE',
          },
        },
      },
    };
    SwaggerModule.setup('api', app, document, options);
  }
}
