import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  FeeDicountRepository,
  FeeStructureRepository,
  StudentRepository,
} from 'src/database/repository';
import { CreateFeeDiscountDto, UpdateFeeDiscountDto } from '../../dtos';
import { FeeDiscount, FeeStructure } from 'src/database/entities';
import AppError from 'src/common/error/AppError';
import { DiscountReason, DiscountType } from 'src/database/enums/fees.enum';

@Injectable()
export class FeeDiscountService {
  protected readonly logger = new Logger(FeeDiscountService.name);
  constructor(
    private readonly feeDiscountRepository: FeeDicountRepository,
    private readonly feeStructureRepository: FeeStructureRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  async applyDiscount(
    payload: CreateFeeDiscountDto,
    user_id: string,
  ): Promise<Partial<FeeDiscount>> {
    const student = await this.studentRepository.findOne({
      id: payload.student_id,
    });
    if (!student) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const feeStructure = await this.feeStructureRepository.findOne({
      id: payload.fee_structure_id,
    });

    if (!feeStructure) {
      throw new AppError('Fee structure not found', HttpStatus.NOT_FOUND);
    }

    const existingDiscount = await this.feeDiscountRepository.findOne({
      fee_structure_id: payload.fee_structure_id,
      student_id: payload.student_id,
      is_active: true,
    });

    if (existingDiscount) {
      throw new AppError(
        'An active discount already exist for this student and fee structure',
        HttpStatus.CONFLICT,
      );
    }

    if (payload.discount_type === DiscountType.PERCENTAGE) {
      if (payload.discount_value < 0 || payload.discount_value > 100) {
        throw new AppError(
          'Percentage discount must be between 0 and 100',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      payload.discount_type === DiscountType.FIXED &&
      payload.discount_value > feeStructure.amount
    ) {
      throw new AppError(
        'Fixed discount must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newFeeDiscount = await this.feeDiscountRepository.create({
      ...payload,
      approved_by: user_id,
      is_active: true,
    });

    return newFeeDiscount.toPayload();
  }

  async getStudentDiscounts(
    student_id: string,
  ): Promise<Partial<FeeDiscount>[]> {
    const student = await this.studentRepository.findOne({ id: student_id });

    if (!student) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const discount = await this.feeDiscountRepository.findMany({
      where: { student_id },
      relations: { fee_structure: { fee_category: true } },
      order: { created_at: 'DESC' },
    });

    return discount.map((feeDiscount) => feeDiscount.toPayload());
  }

  async updateDiscount(
    discount_id: string,
    payload: UpdateFeeDiscountDto,
  ): Promise<Partial<FeeDiscount>> {
    const existingFeeDiscount = await this.feeDiscountRepository.findOne({
      id: discount_id,
    });

    if (!existingFeeDiscount) {
      throw new AppError('Fee discount not found', HttpStatus.NOT_FOUND);
    }

    if (existingFeeDiscount.approved_by) {
      throw new AppError(
        'Cannot update an already approved discount',
        HttpStatus.CONFLICT,
      );
    }

    if (
      payload.discount_type === DiscountType.PERCENTAGE &&
      payload.discount_value !== undefined
    ) {
      if (payload.discount_value < 0 || payload.discount_value > 100) {
        throw new AppError(
          'Percentage discount must be between 0 and 100',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = await this.feeDiscountRepository.update(
      { id: discount_id },
      payload,
    );

    return updated.toPayload();
  }

  async removeDiscount(discount_id: string): Promise<void> {
    const existingDiscount = await this.feeDiscountRepository.findOne({
      id: discount_id,
    });
    if (!existingDiscount) {
      throw new AppError('Fee discount not found', HttpStatus.NOT_FOUND);
    }

    await this.feeDiscountRepository.update(
      { id: discount_id },
      { is_active: false },
    );
  }
}
