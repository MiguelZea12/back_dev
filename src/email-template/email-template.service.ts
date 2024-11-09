import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplateService {
  private readonly templatesPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, 'templates');
  }

  async renderTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(this.templatesPath, `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
      throw new HttpException(
        'Error al intentar renderizar un template de correo electrónico',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    return template(context);
  }
}
