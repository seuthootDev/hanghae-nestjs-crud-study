import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

describe('AppController', () => {
  let appController: BoardController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService],
    }).compile();

    appController = app.get<BoardController>(BoardController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
