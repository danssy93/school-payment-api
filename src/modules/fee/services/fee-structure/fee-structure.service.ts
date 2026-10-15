import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  FeeCategoryRepository,
  FeeStructureRepository,
} from 'src/database/repository';
import { CreateFeeStructureDto, UpdateFeeStructureDto } from '../../dtos';
import { FeeStructure } from 'src/database/entities';
import AppError from 'src/common/error/AppError';

@Injectable()
export class FeeStructureService {
  protected readonly logger = new Logger(FeeStructureService.name);

  constructor(
    private readonly feeStructureRepository: FeeStructureRepository,
    private readonly feeCategoryRepository: FeeCategoryRepository,
  ) {}

  async createStructure(
    payload: CreateFeeStructureDto,
    user_id: string,
  ): Promise<Partial<FeeStructure>> {
    const existingFeeCategory = await this.feeCategoryRepository.findOne({
      id: payload.fee_category_id,
    });

    if (!existingFeeCategory) {
      throw new AppError('Fee-category not found', HttpStatus.NOT_FOUND);
    }

    const existingFeeStructure = await this.feeStructureRepository.findOne({
      fee_category_id: payload.fee_category_id,
      class_id: payload.class_id,
      class_arm_id: payload.class_arm_id,
      term_id: payload.term_id,
      session_id: payload.session_id,
    });

    if (existingFeeStructure) {
      throw new AppError('Fee structure already exist', HttpStatus.CONFLICT);
    }

    const newFeeStructure = await this.feeStructureRepository.create({
      ...payload,
      created_by: user_id,
    });

    return newFeeStructure.toPayload();
  }

  async getAllStructures(): Promise<Partial<FeeStructure>[]> {
    const feeStructures = await this.feeStructureRepository.findMany({
      relations: {
        fee_category: true,
        class: true,
        term: true,
        session: true,
      },
      order: { created_at: 'DESC' },
    });

    return feeStructures.map((feeStructure) => feeStructure.toPayload());
  }

  async getStructuresByClass(
    class_id: string,
  ): Promise<Partial<FeeStructure>[]> {
    const feeStructure = await this.feeStructureRepository.findMany({
      where: { class_id },
      relations: { fee_category: true, term: true, session: true },
      order: { created_at: 'DESC' },
    });

    if (!feeStructure) {
      throw new AppError('Fee-Structure not found', HttpStatus.NOT_FOUND);
    }

    return feeStructure.map((structure) => structure.toPayload());
  }

  async getStructuresByTerm(term_id: string): Promise<Partial<FeeStructure>[]> {
    const feeStructure = await this.feeStructureRepository.findMany({
      where: { term_id },
      relations: { fee_category: true, class: true, session: true },
      order: { created_at: 'DESC' },
    });

    if (!feeStructure) {
      throw new AppError('Fee-Structure not found', HttpStatus.NOT_FOUND);
    }

    return feeStructure.map((structure) => structure.toPayload());
  }

  async findStructure(
    fee_structure_id: string,
  ): Promise<Partial<FeeStructure>> {
    const feeStructure = await this.feeStructureRepository.findOne(
      { id: fee_structure_id },
      {
        relations: {
          fee_category: true,
          class: true,
          class_arm: true,
          term: true,
          session: true,
          fee_discounts: true,
        },
      },
    );

    if (!feeStructure) {
      throw new AppError('feeStructure not found', HttpStatus.NOT_FOUND);
    }

    return feeStructure.toPayload();
  }

  async updateStructure(
    fee_structure_id: string,
    payload: UpdateFeeStructureDto,
  ): Promise<Partial<FeeStructure>> {
    const existingFeeStructure = await this.feeStructureRepository.findOne({
      id: fee_structure_id,
    });

    if (!existingFeeStructure) {
      throw new AppError('Fee structure not found', HttpStatus.NOT_FOUND);
    }

    if (
      payload.fee_category_id &&
      payload.fee_category_id !== existingFeeStructure.fee_category_id
    ) {
      const feeCategory = await this.feeCategoryRepository.findOne({
        id: payload.fee_category_id,
      });

      if (!feeCategory) {
        throw new AppError('Fee category not found', HttpStatus.NOT_FOUND);
      }
    }

    const updatedFeeStructure = await this.feeStructureRepository.update(
      { id: fee_structure_id },
      payload,
    );

    return updatedFeeStructure.toPayload();
  }

  async toggleFeeStructure(
    fee_structure_id: string,
  ): Promise<Partial<FeeStructure>> {
    const existingFeeStructure = await this.feeStructureRepository.findOne({
      id: fee_structure_id,
    });

    if (!existingFeeStructure) {
      throw new AppError('Fee structure not found', HttpStatus.NOT_FOUND);
    }

    const updatedFeeStructure = await this.feeStructureRepository.update(
      { id: fee_structure_id },
      { is_active: !existingFeeStructure.is_active },
    );

    return updatedFeeStructure.toPayload();
  }
}
