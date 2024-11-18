import { Body, Controller, Logger, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { I18nService } from 'nestjs-i18n';
import { ResetPasswordDto } from '@/auth/dto/resetPassword.dto';
import { RequestResetPasswordDto } from '@/auth/dto/requestResetPassword.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('login')
  async login(@Request() req): Promise<{ result: any; message: string }> {
    const result = await this.authService.login(req.body);
    const message = await this.i18n.translate('login_success') as string;
    return { result, message };
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPassword: RequestResetPasswordDto,
  ): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('requesting_password_reset') as string;
    this.logger.log(logMessage);

    await this.authService.requestResetPassword(requestResetPassword);
    const message = await this.i18n.translate('password_reset_requested') as string;
    return { message };
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('resetting_password') as string;
    this.logger.log(logMessage);

    await this.authService.resetPassword(resetPassword);
    const message = await this.i18n.translate('password_reset_success') as string;
    return { message };
  }
}
