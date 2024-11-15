import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { I18nService } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  async getHello(): Promise<{ message: string }> {
    // Convertimos el resultado de translate a string
    const message = await this.i18n.translate('greeting') as string;
    return { message };
  }
}
