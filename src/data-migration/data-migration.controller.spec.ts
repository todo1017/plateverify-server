import { Test, TestingModule } from '@nestjs/testing';
import { DataMigrationController } from './data-migration.controller';

describe('DataMigrationController', () => {
  let controller: DataMigrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataMigrationController],
    }).compile();

    controller = module.get<DataMigrationController>(DataMigrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
