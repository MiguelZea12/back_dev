import { Body, Controller, Logger, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { ResetPasswordDto } from '@/auth/dto/resetPassword.dto';
import { RequestResetPasswordDto } from '@/auth/dto/requestResetPassword.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPassword: RequestResetPasswordDto,
  ): Promise<any> {
    this.logger.log('Intentando solicitar restablecimiento de contraseña..');

    return this.authService.requestResetPassword(requestResetPassword);
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<any> {
    this.logger.log('Intentando restablecer la contraseña..');

    return this.authService.resetPassword(resetPassword);
  }
}
