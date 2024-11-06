import { Controller, Logger, Post, Request } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
