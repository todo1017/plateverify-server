import { Test, TestingModule } from '@nestjs/testing';
import { PschoolService } from './pschool.service';

describe('PschoolService', () => {
  let service: PschoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PschoolService],
    }).compile();

    service = module.get<PschoolService>(PschoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
