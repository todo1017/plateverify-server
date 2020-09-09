import { Test, TestingModule } from '@nestjs/testing';
import { PuserService } from './puser.service';

describe('PuserService', () => {
  let service: PuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuserService],
    }).compile();

    service = module.get<PuserService>(PuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
