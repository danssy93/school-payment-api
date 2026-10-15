import { Test, TestingModule } from '@nestjs/testing';
import { FeeCategoryController } from './fee-category.controller';

describe('FeeCategoryController', () => {
  let controller: FeeCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeCategoryController],
    }).compile();

    controller = module.get<FeeCategoryController>(FeeCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
