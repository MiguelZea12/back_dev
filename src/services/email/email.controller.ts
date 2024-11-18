import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
  ) {}

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

      // Mensaje de éxito
      const successMessage = await this.i18n.translate('email.email_sent_success') as string;
      res.status(HttpStatus.OK).json({ message: successMessage });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Mensaje de error
      const errorMessage = await this.i18n.translate('email.email_send_error') as string;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
    }
  }
}
