import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body('senderName') senderName: string,
    @Body('senderEmail') senderEmail: string,
    @Body('recipientName') recipientName: string,
    @Body('recipientEmail') recipientEmail: string,
    @Body('subject') subject: string,
    @Body('htmlContent') htmlContent: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.emailService.sendEmail(
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        subject,
        htmlContent,
      );

      res.status(HttpStatus.OK).send();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = 'Error en el envió del correo electrónico';

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
    }
  }
}
