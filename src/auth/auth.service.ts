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
import { AuthUserDto } from '@/user/dto/authUser.dto';

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
  ) {}

  async validateUser(document: string, password: string): Promise<AuthUserDto> {
    const user = await this.userService.findOneByDocument(document);

    if (!user) {
      const errorMessage = 'Usuario no econtrado';
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const errorMessage = 'Credeciales invalidas';

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

      return {
        user: {
          id: userData.id,
          document: userData.document,
          name: userData.name,
          lastname: userData.lastName,
          role: userData.role.name_role,
        },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // See if the user was not found or the credentials are invalid
      if (
        error.status === HttpStatus.NOT_FOUND ||
        error.status === HttpStatus.UNAUTHORIZED
      ) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          'Error en el inicio de sesión',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Request to reset password
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
        'Token para restablecer contraseña creado exitosamente!!',
      );

      // Create the URL to send in the email
      const apiUrl = this.configService.get<string>('NEXT_PUBLIC_FRONTEND_URL');
      const resetPasswordUrl = `${apiUrl}/reset-password/${resetPasswordToken}`;

      this.logger.log(
        'Intentando crear el email para restablecer la contraseña',
      );

      // Create the HTML content and send the email
      await this.emailService.sendResetPasswordEmail(
        email,
        user.name,
        resetPasswordUrl,
      );

      this.logger.log('Email para restablecer la contraseña enviado!!');

      return {
        message:
          'Se ha enviado un correo electrónico para reestablecer tu contraseña',
      };
    } catch (error) {
      // See if the user was not found
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          'Error al enviar el correo electrónico para restablecer la contraseña',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Reset the password
  async resetPassword(resetPassword: ResetPasswordDto): Promise<any> {
    const { resetPasswordToken, password } = resetPassword;

    try {
      const user =
        await this.userService.findOneByResetPasswordToken(resetPasswordToken);

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;

      this.userRepository.save(user);

      this.logger.log('Contraseña restablecida exitosamente');

      return {
        message: 'Contraseña restablecida exitosamente',
      };
    } catch (error) {
      // See if the user was not found
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          'Error al intentar cambiar la contraseña del usuario',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
