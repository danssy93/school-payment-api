import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasources';
import { RefreshToken, User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');
        try {
          logger.log('Initializing database connection...');
          return dataSourceOptions;
        } catch (error) {
          logger.error('Database connection failed', error.stack);
          throw error;
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  static forFeature() {
    return TypeOrmModule.forFeature([User, RefreshToken]);
  }
}
