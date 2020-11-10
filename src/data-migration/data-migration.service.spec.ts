import { Test, TestingModule } from '@nestjs/testing';
import { DataMigrationService } from './data-migration.service';

describe('DataMigrationService', () => {
  let service: DataMigrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataMigrationService],
    }).compile();

    service = module.get<DataMigrationService>(DataMigrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
