import { Test, TestingModule } from '@nestjs/testing';
import { PschoolController } from './pschool.controller';

describe('PschoolController', () => {
  let controller: PschoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PschoolController],
    }).compile();

    controller = module.get<PschoolController>(PschoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
