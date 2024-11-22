import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n'; // Importa I18nModule
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailTemplateModule } from '@/email-template/email-template.module';

@Module({
  imports: [
    ConfigModule, 
    EmailTemplateModule, 
    I18nModule, // Importa I18nModule para traducciones
  ],
  providers: [EmailService,I18nModule],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
