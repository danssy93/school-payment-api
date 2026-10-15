import { Test, TestingModule } from '@nestjs/testing';
import { FeeDiscountController } from './fee-discount.controller';

describe('FeeDiscountController', () => {
  let controller: FeeDiscountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeDiscountController],
    }).compile();

    controller = module.get<FeeDiscountController>(FeeDiscountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
