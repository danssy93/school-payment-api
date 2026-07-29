import { CONFIGURATION } from 'src/lib';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: CONFIGURATION.DATABASE.HOST,
  port: CONFIGURATION.DATABASE.PORT,
  username: CONFIGURATION.DATABASE.USERNAME,
  password: CONFIGURATION.DATABASE.PASSWORD,
  database: CONFIGURATION.DATABASE.NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
