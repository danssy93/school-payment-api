import { Module } from '@nestjs/common';
import { FeeCategoryService } from './services/fee-category/fee-category.service';
import { FeeStructureService } from './services/fee-structure/fee-structure.service';
import { FeeDiscountService } from './services/fee-discount/fee-discount.service';
import { FeeCategoryController } from './controllers/fee-category/fee-category.controller';
import { FeeStructureController } from './controllers/fee-structure/fee-structure.controller';
import { FeeDiscountController } from './controllers/fee-discount/fee-discount.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FeeCategoryRepository } from 'src/database/repository/feeCategory.repository';
import { FeeStructureRepository } from 'src/database/repository/feeStructure.repository';
import { FeeDicountRepository } from 'src/database/repository/feeDiscount.repository';
import { StudentRepository } from 'src/database/repository';

@Module({
  imports: [DatabaseModule.forFeature()],
  providers: [
    FeeCategoryService,
    FeeStructureService,
    FeeDiscountService,
    FeeCategoryRepository,
    FeeStructureRepository,
    FeeDicountRepository,
    StudentRepository,
  ],
  controllers: [
    FeeCategoryController,
    FeeStructureController,
    FeeDiscountController,
  ],
})
export class FeeModule {}
