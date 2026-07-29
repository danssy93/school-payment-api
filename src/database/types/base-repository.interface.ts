import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T>;

  createMany(data: DeepPartial<T>[], queryRunner?: QueryRunner): Promise<void>;

  findOne(
    where: FindOptionsWhere<T>,
    options?: Omit<FindOptionsWhere<T>, 'where'>,
  ): Promise<T | null>;

  find(options?: FindManyOptions<T>): Promise<T[]>;

  update(
    filterQuery: FindOptionsWhere<T>,
    update: QueryDeepPartialEntity<T>,
  ): Promise<T>;

  delete(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<number>;

  softDelete(
    where: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<number>;

  count(where?: FindOptionsWhere<T>): Promise<number>;
}
