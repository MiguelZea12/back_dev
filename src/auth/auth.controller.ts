import { Body, Controller, Logger, Patch, Post, Request, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      const result = await this.authService.login(req.body);
      const message = await this.i18n.translate('auth.login_success') as string;
      return { result, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.login_error') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPassword: RequestResetPasswordDto,
  ): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('auth.requesting_password_reset') as string;
    this.logger.log(logMessage);

    try {
      await this.authService.requestResetPassword(requestResetPassword);
      const message = await this.i18n.translate('auth.password_reset_requested') as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.reset_password_email_error') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('auth.resetting_password') as string;
    this.logger.log(logMessage);

    try {
      await this.authService.resetPassword(resetPassword);
      const message = await this.i18n.translate('auth.password_reset_success') as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.reset_password_error') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
