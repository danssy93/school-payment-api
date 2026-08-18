import { Test, TestingModule } from '@nestjs/testing';
import { BursarClassController } from './bursar-class.controller';

describe('BursarClassController', () => {
  let controller: BursarClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BursarClassController],
    }).compile();

    controller = module.get<BursarClassController>(BursarClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
