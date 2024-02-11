export type TConfiguration = {
  jwtSecret: string;
  database: {
    type: string;
    host: string;
    port: number;
    username: string;
    database: string;
  };
};
