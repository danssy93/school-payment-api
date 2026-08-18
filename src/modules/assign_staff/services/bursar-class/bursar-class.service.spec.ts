import { Test, TestingModule } from '@nestjs/testing';
import { BursarClassService } from './bursar-class.service';

describe('BursarClassService', () => {
  let service: BursarClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BursarClassService],
    }).compile();

    service = module.get<BursarClassService>(BursarClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
