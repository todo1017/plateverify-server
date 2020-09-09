import { Test, TestingModule } from '@nestjs/testing';
import { PuserController } from './puser.controller';

describe('PuserController', () => {
  let controller: PuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuserController],
    }).compile();

    controller = module.get<PuserController>(PuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
