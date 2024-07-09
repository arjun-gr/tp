// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export default () => {
  return {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      primarydb: process.env.DB_NAME,
      password: process.env.DB_PASS,
    },
    api: {
      url: (() =>
        process.env.APP_PORT
          ? `${process.env.CLIENT_APP_DOMAIN}:${process.env.APP_PORT}`
          : `${process.env.CLIENT_APP_DOMAIN}`)(),
    },
    config: {
      CERTIFICATE_AUTHORITY: `${process.env.CERTIFICATE_AUTHORITY}`,
    },
  };
};
