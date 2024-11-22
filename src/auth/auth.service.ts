import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { User } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { RequestResetPasswordDto } from '@/auth/dto/requestResetPassword.dto';
import { EmailService } from '@/services/email/email.service';
import { ResetPasswordDto } from '@/auth/dto/resetPassword.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  async validateUser(document: string, password: string): Promise<any> {
    const user = await this.userService.findOneByDocument(document);

    if (!user) {
      const errorMessage = await this.i18n.translate('auth.errors.user_not_found') as string;
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const errorMessage = await this.i18n.translate('auth.errors.invalid_credentials') as string;
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async login(user: any) {
    try {
      const userData = await this.validateUser(user.document, user.password);

      const payload = {
        sub: userData.id,
        document: userData.document,
      };

      const message = await this.i18n.translate('auth.success.login') as string;

      return {
        user: {
          id: userData.id,
          document: userData.document,
          name: userData.name,
          role: userData.role,
        },
        access_token: this.jwtService.sign(payload),
        message,
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.errors.login') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async requestResetPassword(requestResetPassword: RequestResetPasswordDto): Promise<any> {
    const { email } = requestResetPassword;

    try {
      const user = await this.userService.findOneByEmail(email);

      user.resetPasswordToken = v4();
      const resetPasswordToken = user.resetPasswordToken;

      await this.userRepository.save(user);

      this.logger.log(await this.i18n.translate('auth.success.reset_password_token_created'));

      const apiUrl = this.configService.get<string>('NEXT_PUBLIC_FRONTEND_URL');
      const resetPasswordUrl = `${apiUrl}/reset-password/${resetPasswordToken}`;

      await this.emailService.sendResetPasswordEmail(email, user.name, resetPasswordUrl);

      const message = await this.i18n.translate('auth.success.reset_password_email_sent') as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.errors.reset_password_email_error') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetPassword: ResetPasswordDto): Promise<any> {
    const { resetPasswordToken, password } = resetPassword;

    try {
      const user = await this.userService.findOneByResetPasswordToken(resetPasswordToken);

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;

      await this.userRepository.save(user);

      const message = await this.i18n.translate('auth.success.password_reset_success') as string;
      this.logger.log(message);

      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('auth.errors.reset_password_error') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
