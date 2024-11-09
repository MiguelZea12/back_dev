import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(document: string, password: string): Promise<any> {
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
          role: userData.role,
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
}
