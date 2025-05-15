import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidate.controller';
import { BadRequestException } from '@nestjs/common';

describe('CandidateController', () => {
  let controller: CandidateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); //verify that the controller is instantiated correctly
  });

  describe('validateFile', () => {
    it('should throw BadRequestException if file is missing', () => {
      //test that the method throws an exception when no file is provided
      expect(() => controller['validateFile'](null)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file does not have a buffer', () => {
      //test that the method throws an exception when the file lacks a buffer
      const file = {} as Express.Multer.File;
      expect(() => controller['validateFile'](file)).toThrow(
        BadRequestException,
      );
    });

    it('should not throw if file is valid', () => {
      //test that the method does not throw an exception for a valid file
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      expect(() => controller['validateFile'](file)).not.toThrow();
    });
  });

  describe('mapToCandidateResponse', () => {
    it('should map data correctly', () => {
      //test that the method correctly maps the body and excel row to the response format
      const body = { name: 'Juana', surname: 'Morillo' };
      const excelRow = {
        seniority: 'Junior',
        'years of experience': 1,
        availability: true,
      };

      const result = controller['mapToCandidateResponse'](body, excelRow);
      expect(result).toEqual({
        name: 'Juana',
        surname: 'Morillo',
        seniority: 'Junior',
        years: 1,
        availability: true,
      });
    });
  });
});
