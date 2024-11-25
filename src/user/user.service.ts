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
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly i18n: I18nService,
  ) {}

  private async createHttpException(
    messageKey: string,
    args: any,
    status: HttpStatus = HttpStatus.NOT_FOUND,
  ): Promise<HttpException> {
    const errorMsg = await this.i18n.t(messageKey, { args });
    this.logger.error(errorMsg);
    return new HttpException(errorMsg, status);
  }

  async findByOneById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw await this.createHttpException('user.error_user_not_found', { id });
    }

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    });
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

      this.logger.log(await this.i18n.t('user.fetching_all_users'));

      const totalPages = Math.ceil(totalCount / limit);

      const userDtos = users.map((user) =>
        plainToInstance(GetUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      return {
        data: userDtos,
        totalCount,
        userPerPage: userDtos.length,
        totalPages,
      };
    } catch (error) {
      const errorMessage = await this.i18n.t('user.error_fetching_users');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(userDto: CreateUserDto): Promise<GetUserDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const roleDb = await this.roleService.findByName(userDto.role.name_role);

    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
      role: roleDb,
    });

    const savedUser = await this.userRepository.save(newUser);

    this.logger.log(await this.i18n.t('user.user_created'));

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
      throw await this.createHttpException('user.error_user_not_found', { id });
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(await this.i18n.t('user.user_updated'));

    return plainToInstance(GetUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByDocument(document: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { document },
      relations: ['role'],
    });

    if (!user) {
      const errorMsg = await this.i18n.t('user.error_user_not_found', {
        args: { document },
      });
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<AuthUserDto> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      const errorMsg = await this.i18n.t('user.error_user_not_found', {
        args: { email },
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
      relations: ['role'],
    });

    if (!user) {
      const errorMsg = await this.i18n.t('user.error_user_not_found', {
        args: { resetPasswordToken },
      });
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    return user;
  }
}
