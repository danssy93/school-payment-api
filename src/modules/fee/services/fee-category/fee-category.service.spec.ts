import { Test, TestingModule } from '@nestjs/testing';
import { FeeCategoryService } from './fee-category.service';

describe('FeeCategoryService', () => {
  let service: FeeCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeCategoryService],
    }).compile();

    service = module.get<FeeCategoryService>(FeeCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
