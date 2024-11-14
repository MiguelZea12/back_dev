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
import { FiltersUserDto } from './dto/filtersUser.dto';
import { RoleService } from '@/role/role.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly roleService: RoleService,
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

  async findOneByDocument(document: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { document },
      relations: ['role'],
    });

    if (!user) {
      const errorMsg = this.MessageNotFounded('numero de cédula', document);
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByOneById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
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

  async findOneByResetPasswordToken(
    resetPasswordToken: string,
  ): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken },
      relations: ['role'],
    });

    if (!user) {
      const errorMsg = 'Usuario no encontrado';
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    return user;
  }

  async findAllFilter(filtersUserDto: FiltersUserDto): Promise<any> {
    const { document, name_role, page = 1, limit = 10 } = filtersUserDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (document) {
      query.andWhere('user.document ILIKE :document', {
        document: `%${document}%`,
      });
    }

    if (name_role) {
      query.andWhere('role.name_role ILIKE :name_role', {
        name_role: `%${name_role}%`,
      });
    }

    // Order by createdAt in descending order
    query.orderBy('user.createdAt', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    try {
      const [users, totalCount] = await query.getManyAndCount();

      this.logger.log('Buscando usuarios..');

      const totalPages = Math.ceil(totalCount / limit);

      const userDtos = users.map((user) =>
        plainToInstance(GetUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      const userPaginated: any = {
        data: userDtos,
        totalCount,
        userPerPage: userDtos.length,
        totalPages,
      };

      return {
        UserPaginated: userPaginated,
        totalCount,
      };
    } catch (error) {
      const errorMessage = 'Error buscando los usuarios';

      this.logger.error(errorMessage, error.stack);

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(userDto: CreateUserDto): Promise<GetUserDto> {
    const { name, lastName, role, password, email, document, direction } =
      userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findOne({
      where: [{ document }, { email }],
    });

    if (user) {
      const errorMsg = 'Un usuario con la misma cédula o email ya existe';
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    const roleDb = await this.roleService.findByName(role.name_role);

    const newUser = this.userRepository.create({
      name,
      lastName,
      role: roleDb,
      password: hashedPassword,
      email,
      document,
      direction,
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

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      const errorMsg = this.MessageNotFounded('ID', id);
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    user.deleted = true;

    await this.userRepository.save(user);

    const successMsg = 'Usuario eliminado exitosamente!!!';

    this.logger.log(successMsg);
  }
}
