import { Body, Controller, Logger, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { ResetPasswordDto } from '@/auth/dto/resetPassword.dto';
import { RequestResetPasswordDto } from '@/auth/dto/requestResetPassword.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('login')
  async login(@Request() req) {
    try {
      const response = await this.authService.login(req.body);
      this.logger.log(await this.i18n.t('auth.login_success'));
      return response;
    } catch (error) {
      const errorMsg = await this.i18n.t('auth.login_error');
      this.logger.error(errorMsg, error.stack);
      throw error;
    }
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPassword: RequestResetPasswordDto,
  ): Promise<any> {
    this.logger.log(await this.i18n.t('auth.requesting_password_reset'));

    try {
      const response = await this.authService.requestResetPassword(
        requestResetPassword,
      );
      this.logger.log(await this.i18n.t('auth.password_reset_requested'));
      return response;
    } catch (error) {
      const errorMsg = await this.i18n.t('auth.reset_password_email_error');
      this.logger.error(errorMsg, error.stack);
      throw error;
    }
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<any> {
    this.logger.log(await this.i18n.t('auth.resetting_password'));

    try {
      const response = await this.authService.resetPassword(resetPassword);
      this.logger.log(await this.i18n.t('auth.password_reset_success'));
      return response;
    } catch (error) {
      const errorMsg = await this.i18n.t('auth.reset_password_error');
      this.logger.error(errorMsg, error.stack);
      throw error;
    }
  }
}
