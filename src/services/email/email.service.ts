import { EmailTemplateService } from '@/email-template/email-template.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import axios from 'axios';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly i18n: I18nService, // Inyección de I18nService
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

      const successMessage = await this.i18n.translate('email.email_sent_success') as string;
      console.log(`[EmailService] ${successMessage}`);
    } catch (error) {
      const errorMessage = await this.i18n.translate('errors.email.send_error') as string;
      console.error(`[EmailService] ${errorMessage}`, error.message);
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    resetPasswordUrl: string,
  ): Promise<void> {
    const context = {
      name,
      url: resetPasswordUrl,
    };

    // Render HTML content from the template
    const htmlContent = await this.emailTemplateService.renderTemplate(
      'resetPasswordEmail',
      context,
    );

    // Get sender email from environment variables
    const senderEmail: string = this.configService.get<string>('EMAIL_SOFTWARE');

    // Localized subject
    const subject = await this.i18n.translate('email.reset_password_subject') as string;

    // Send the email with the generated content
    await this.sendEmail(
      'Software Vinculación',
      senderEmail,
      name,
      email,
      subject,
      htmlContent,
    );
  }
}
