import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Workbook } from 'exceljs';

interface CandidateExcelRow {
  seniority: string;
  'years of experience': number;
  availability: boolean;
  [key: string]: any;
}

interface CandidateResponse {
  name: string;
  surname: string;
  seniority: string;
  years: number;
  availability: boolean;
}

@Controller('candidates')
export class CandidateController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; surname: string },
  ): Promise<CandidateResponse[]> {
    this.validateFile(file);

    const data = await this.parseExcelFile(file);

    this.validateExcelData(data);

    const candidateData = this.mapToCandidateResponse(body, data[0]);

    return [candidateData];
  }

  private validateFile(file: Express.Multer.File | null): void {
    if (!file || !file.buffer) {
      throw new BadRequestException(
        'File is required and must contain a buffer',
      );
    }
  }

  private async parseExcelFile(
    file: Express.Multer.File,
  ): Promise<CandidateExcelRow[]> {
    try {
      const workbook = new Workbook();
      await workbook.xlsx.load(file.buffer); //load the excel file from the buffer

      const worksheet = workbook.worksheets[0]; //get the first worksheet
      if (!worksheet) {
        throw new BadRequestException(
          'The Excel file does not contain any sheets',
        );
      }

      const rows: CandidateExcelRow[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; //skip the header row
        rows.push({
          seniority: row.getCell(1).value as string, //get seniority from the first column
          'years of experience': row.getCell(2).value as number, //get years of experience from the second column
          availability: row.getCell(3).value as boolean, //get availability from the third column
        });
      });

      return rows;
    } catch {
      throw new BadRequestException('Failed to parse the Excel file');
    }
  }

  private validateExcelData(data: CandidateExcelRow[]): void {
    if (data.length !== 1) {
      throw new BadRequestException(
        'The Excel file must contain exactly one row',
      );
    }

    const row = data[0];
    if (
      !row.seniority ||
      !row['years of experience'] ||
      row.availability === undefined
    ) {
      throw new BadRequestException(
        'The Excel file must contain valid seniority, years of experience, and availability fields',
      );
    }
  }

  private mapToCandidateResponse(
    body: { name: string; surname: string },
    excelRow: CandidateExcelRow,
  ): CandidateResponse {
    return {
      name: body.name,
      surname: body.surname,
      seniority: excelRow.seniority,
      years: excelRow['years of experience'],
      availability: excelRow.availability,
    };
  }
}
