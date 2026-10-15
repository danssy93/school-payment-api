import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FeeCategoryRepository } from 'src/database/repository';
import { CreateFeeCategoryDto, UpdateFeeCategoryDto } from '../../dtos';
import { FeeCategory } from 'src/database/entities';
import AppError from 'src/common/error/AppError';

@Injectable()
export class FeeCategoryService {
  protected readonly logger = new Logger(FeeCategoryService.name);

  constructor(private readonly feeCategoryRepository: FeeCategoryRepository) {}

  async createCategory(
    payload: CreateFeeCategoryDto,
    user_id: string,
  ): Promise<Partial<FeeCategory>> {
    const category = await this.feeCategoryRepository.findOne({
      name: payload.name,
    });

    if (category) {
      throw new AppError(
        'Category with the name already exist',
        HttpStatus.CONFLICT,
      );
    }

    const newCategory = await this.feeCategoryRepository.create({
      ...payload,
      created_by: user_id,
    });

    return newCategory.toPayload();
  }

  async getAllCategories(): Promise<Partial<FeeCategory>[]> {
    const categories = await this.feeCategoryRepository.findMany({
      order: { created_at: 'DESC' },
    });

    return categories.map((category) => category.toPayload());
  }

  async findCategory(category_id: string): Promise<Partial<FeeCategory>> {
    const category = await this.feeCategoryRepository.findOne({
      id: category_id,
    });

    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    return category.toPayload();
  }

  async updateCategory(
    category_id: string,
    payload: UpdateFeeCategoryDto,
  ): Promise<Partial<FeeCategory>> {
    const existingCategory = await this.feeCategoryRepository.findOne({
      id: category_id,
    });

    if (!existingCategory) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    if (payload.name && payload.name !== existingCategory.name) {
      const duplicateName = await this.feeCategoryRepository.findOne({
        name: payload.name,
      });

      if (duplicateName) {
        throw new AppError(
          'Category with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateCategory = await this.feeCategoryRepository.update(
      { id: category_id },
      payload,
    );

    return updateCategory.toPayload();
  }

  async toggleCategory(category_id: string): Promise<Partial<FeeCategory>> {
    const existingCategory = await this.feeCategoryRepository.findOne({
      id: category_id,
    });

    if (!existingCategory) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    const updateCategory = await this.feeCategoryRepository.update(
      { id: category_id },
      { is_active: !existingCategory.is_active },
    );

    return updateCategory.toPayload();
  }
}
