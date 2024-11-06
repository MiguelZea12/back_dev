import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { User } from '@/user/user.entity';
import { AuthUserDto } from '@/user/dto/authUser.dto';
import { GetUserDto } from '@/user/dto/getUser.dto';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Const Message for Not Found
  private MessageNotFounded(option: string, key: any) {
    return `Usuario con ${option}: ${key}, no encontrado.`;
  }

  private async createHttpException(
    messageKey: string,
    status: HttpStatus = HttpStatus.NOT_FOUND,
  ): Promise<HttpException> {
    const errorMsg = messageKey as string;

    this.logger.error(errorMsg);
    return new HttpException(errorMsg, status);
  }

  async findOneByUsername(username: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      const errorMsg = this.MessageNotFounded('username', username);
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByOneById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      const errorMsg = this.MessageNotFounded('ID', id);

      this.logger.error(errorMsg);

      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByEmail(email: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      const errorMsg = this.MessageNotFounded('email', email);

      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<GetUserDto> {
    const { username, role, password, email, document, direction, status } =
      userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      role,
      password: hashedPassword,
      email,
      document,
      direction,
      status,
    });

    const savedUser = await this.userRepository.save(newUser);

    const getUserDto = plainToInstance(GetUserDto, savedUser, {
      excludeExtraneousValues: true,
    });

    const successMsg = 'El usuario ha sido creado existosamente!!';
    this.logger.log(successMsg);

    return getUserDto;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      const errorMsg = this.MessageNotFounded('ID', id);
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    if (Object.keys(updateUserDto).length === 0) {
      const errorMsg = 'Los datos a actualizar no pueden estar vacios';

      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save(user);

    const getUserDto = plainToInstance(GetUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });

    const successMsg = 'El usuario ha sido actualizado existosamente!!';
    this.logger.log(successMsg);

    return getUserDto;
  }
}
