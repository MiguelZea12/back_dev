import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const configService = new ConfigService();

export const dataBaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
    __dirname + '/../**/entity/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  ssl: {
    ca: fs
      .readFileSync(__dirname + '/../../ssl/DigiCertGlobalRootG2.crt.pem')
      .toString(),
    rejectUnauthorized: true,
  },
};

const dataSource = new DataSource(dataBaseConfig);

export default dataSource;
