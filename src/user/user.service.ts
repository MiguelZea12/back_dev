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
import { I18nService } from 'nestjs-i18n';
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
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly i18n: I18nService,
  ) {}

  async findOneByDocument(document: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { document },
      relations: ['role'],
    });

    if (!user) {
      const errorMsg = await this.i18n.translate('user.errors.not_found', {
        args: { option: 'document', value: document },
      });
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
      const errorMsg = await this.i18n.translate('user.errors.not_found', {
        args: { option: 'ID', value: id },
      });

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
      const errorMsg = await this.i18n.translate('user.errors.not_found', {
        args: { option: 'email', value: email },
      });

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
    });

    if (!user) {
      const errorMsg = await this.i18n.translate('user.errors.not_found', {
        args: { option: 'resetPasswordToken', value: resetPasswordToken },
      });
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    return user;
  }

  async findAllFilter(filtersUserDto: FiltersUserDto): Promise<any> {
    const { username, name_role, page = 1, limit = 10 } = filtersUserDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (name_role) {
      query.andWhere('role.name_role ILIKE :name_role', {
        name_role: `%${name_role}%`,
      });
    }

    query.orderBy('user.createdAt', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    try {
      const [users, totalCount] = await query.getManyAndCount();

      const totalPages = Math.ceil(totalCount / limit);

      const userDtos = users.map((user) =>
        plainToInstance(GetUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      return {
        data: userDtos,
        totalCount,
        totalPages,
        userPerPage: userDtos.length,
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate('user.errors.fetching');
      this.logger.error(errorMessage, error.stack);

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(userDto: CreateUserDto): Promise<GetUserDto> {
    const { name, lastName, role, password, email, document, direction, status } =
      userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleDb = await this.roleService.findByName(role.name_role);

    const newUser = this.userRepository.create({
      name,
      lastName,
      role: roleDb,
      password: hashedPassword,
      email,
      document,
      direction,
      status,
    });

    const savedUser = await this.userRepository.save(newUser);

    const successMsg = await this.i18n.translate('user.success.created');
    this.logger.log(successMsg);

    return plainToInstance(GetUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      const errorMsg = await this.i18n.translate('user.errors.not_found', {
        args: { option: 'ID', value: id },
      });
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    if (Object.keys(updateUserDto).length === 0) {
      const errorMsg = await this.i18n.translate('user.errors.empty_update');
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    const successMsg = await this.i18n.translate('user.success.updated', {
      args: { id },
    });
    this.logger.log(successMsg);

    return plainToInstance(GetUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
