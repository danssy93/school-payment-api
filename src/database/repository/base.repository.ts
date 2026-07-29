import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryDeepPartialEntity,
  QueryRunner,
  Repository,
} from 'typeorm';
import { IBaseRepository } from '../types';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  createQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }

  async create(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> {
    const create = this.repository.create(data);

    if (queryRunner) {
      const saved = await queryRunner.manager.save(create);
      return saved;
    }

    return await this.repository.save(create);
  }

  async createMany(
    data: DeepPartial<T>[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager
        .getRepository<T>(this.repository.target)
        .insert(data as any);
      return;
    }

    await this.repository.insert(data as any);
  }

  async findOne(
    filterQuery: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    const record = await this.repository.findOne({
      where: filterQuery,
      ...options,
    });

    return record;
  }

  async find(options?: FindManyOptions<T> | FindOptionsWhere<T>): Promise<T[]> {
    if (!options) {
      return this.repository.find();
    }

    if (!('where' in options)) {
      return await this.repository.find({
        where: options as FindOptionsWhere<T>,
      });
    }

    return await this.repository.find(options as FindManyOptions<T>);
  }

  async findMany(
    options?: FindManyOptions<T> | FindOptionsWhere<T>,
  ): Promise<T[]> {
    if (!options) {
      return await this.repository.find();
    }

    const isPlainWhere =
      typeof options === 'object' &&
      !(
        'skip' in options ||
        'take' in options ||
        'order' in options ||
        'relations' in options ||
        'select' in options ||
        'where' in options
      );

    if (isPlainWhere) {
      return await this.repository.find({
        where: options as FindOptionsWhere<T>,
      });
    }

    return await this.repository.find(options as FindManyOptions<T>);
  }

  async update(
    filterQuery: FindOptionsWhere<T>,
    payload: QueryDeepPartialEntity<T>,
    queryRunner?: QueryRunner,
  ): Promise<T> {
    if (queryRunner) {
      await queryRunner?.manager.update(
        this.repository.target,
        filterQuery,
        payload,
      );

      const updated = await queryRunner.manager.findOneBy(
        this.repository.target,
        filterQuery,
      );

      if (!updated) {
        throw new Error('Record not found');
      }
      return updated;
    }

    await this.repository.update(filterQuery, payload);

    const updated = await this.repository.findOneBy(filterQuery);
    if (!updated) {
      throw new Error('Record not found');
    }
    return updated;
  }

  merge<T extends Object>(target: T, source: Partial<T>): T {
    return Object.assign(target, source);
  }

  async save(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      const entity = this.repository.create(data);
      return await queryRunner.manager.save(entity);
    }
    return this.repository.save(data);
  }

  async delete(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    if (queryRunner) {
      const result = await queryRunner.manager.delete(
        this.repository.target,
        where,
      );
      return result.affected || 0;
    }
    const result = await this.repository.delete(where);
    return result.affected || 0;
  }

  async softDelete(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    if (queryRunner) {
      const result = await queryRunner.manager.softDelete(
        this.repository.target,
        where,
      );
      return result.affected || 0;
    }

    const result = await this.repository.softDelete(where);
    return result.affected || 0;
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count({ where });
  }

  async advancedCount(
    options?: FindManyOptions<T> | FindOptionsWhere<T>,
  ): Promise<number> {
    if (!options) {
      return await this.repository.count();
    }

    const isPlainWhere =
      typeof options === 'object' &&
      !(
        'skip' in options ||
        'take' in options ||
        'order' in options ||
        'relations' in options ||
        'select' in options ||
        'where' in options
      );

    if (isPlainWhere) {
      return await this.repository.count({
        where: options as FindOptionsWhere<T>,
      });
    }

    return await this.repository.count(options as FindManyOptions<T>);
  }

  async truncate(tableName: string, queryRunner?: QueryRunner): Promise<void> {
    if (queryRunner) {
      await queryRunner.query(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
      );
    } else {
      await this.repository.query(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
      );
    }
  }
}
