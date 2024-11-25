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
    private readonly i18n: I18nService,
  ) {}

  async validateUser(document: string, password: string): Promise<any> {
    const user = await this.userService.findOneByDocument(document);

    if (!user) {
      const errorMessage = await this.i18n.t('auth.error_user_not_found');
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const errorMessage = await this.i18n.t('auth.error_invalid_credentials');
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

      this.logger.log(await this.i18n.t('auth.login_success'));

      return {
        user: {
          id: userData.id,
          document: userData.document,
          name: userData.name,
          role: userData.role,
        },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (
        error.status === HttpStatus.NOT_FOUND ||
        error.status === HttpStatus.UNAUTHORIZED
      ) {
        throw error;
      } else {
        const errorMessage = await this.i18n.t('auth.login_error');
        this.logger.error(errorMessage, error.stack);
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async requestResetPassword(
    requestResetPassword: RequestResetPasswordDto,
  ): Promise<any> {
    const { email } = requestResetPassword;

    try {
      const user = await this.userService.findOneByEmail(email);

      user.resetPasswordToken = v4();
      const resetPasswordToken = user.resetPasswordToken;

      await this.userRepository.save(user);

      this.logger.log(
        await this.i18n.t('auth.reset_password_token_created'),
      );

      const apiUrl = this.configService.get<string>('NEXT_PUBLIC_FRONTEND_URL');
      const resetPasswordUrl = `${apiUrl}/reset-password/${resetPasswordToken}`;

      await this.emailService.sendResetPasswordEmail(
        email,
        user.name,
        resetPasswordUrl,
      );

      this.logger.log(await this.i18n.t('auth.reset_password_email_sent'));

      return {
        message: await this.i18n.t('auth.reset_password_email_sent'),
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        const errorMessage = await this.i18n.t(
          'auth.reset_password_email_error',
        );
        this.logger.error(errorMessage, error.stack);
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async resetPassword(resetPassword: ResetPasswordDto): Promise<any> {
    const { resetPasswordToken, password } = resetPassword;

    try {
      const user =
        await this.userService.findOneByResetPasswordToken(resetPasswordToken);

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;

      await this.userRepository.save(user);

      this.logger.log(await this.i18n.t('auth.password_reset_success'));

      return {
        message: await this.i18n.t('auth.password_reset_success'),
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        const errorMessage = await this.i18n.t('auth.reset_password_error');
        this.logger.error(errorMessage, error.stack);
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
