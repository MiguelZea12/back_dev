import { EmailTemplateService } from '@/email-template/email-template.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly i18n: I18nService,
  ) {}

  async sendEmail(
    senderName: string,
    senderEmail: string,
    recipientName: string,
    recipientEmail: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const apiUrl = this.configService.get<string>('EMAIL_API_URL');
    const apiKey = this.configService.get<string>('EMAIL_API_KEY');

    const data = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject,
      htmlContent,
    };

    try {
      await axios.post(apiUrl, data, {
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = await this.i18n.t('email.email_send_error');
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    resetPasswordUrl: string,
  ): Promise<void> {
    // Data to insert into the template
    const context = {
      name,
      url: resetPasswordUrl,
    };

    // Generate the final HTML content
    const htmlContent = await this.emailTemplateService.renderTemplate(
      'resetPasswordEmail',
      context,
    );

    // Obtain the email for sender
    const senderEmail: string =
      this.configService.get<string>('EMAIL_SOFTWARE');

    // Send the email with the generated content
    await this.sendEmail(
      'Software Vinculación',
      senderEmail,
      name,
      email,
      await this.i18n.t('email.reset_password_subject'), // Clave para la línea del asunto (opcional)
      htmlContent,
    );
  }
}
