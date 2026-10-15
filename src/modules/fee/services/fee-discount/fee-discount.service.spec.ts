import { Test, TestingModule } from '@nestjs/testing';
import { FeeDiscountService } from './fee-discount.service';

describe('FeeDiscountService', () => {
  let service: FeeDiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeDiscountService],
    }).compile();

    service = module.get<FeeDiscountService>(FeeDiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
