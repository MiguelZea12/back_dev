import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { I18nService } from 'nestjs-i18n';
import { GetUserDto } from '@/user/dto/getUser.dto';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';
import { FiltersUserDto } from './dto/filtersUser.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @Get(':id')
  async findRoleById(
    @Param('id') id: number,
  ): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('user.finding_user_by_id', {
      args: { id },
    });
    this.logger.log(logMessage);

    try {
      const user = await this.userService.findByOneById(id);
      const message = await this.i18n.translate('user.success.found', { args: { id } });
      return { user, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('user.errors.not_found', {
        args: { id },
      });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAllFiltered(
    @Query() filtersUserDto: FiltersUserDto,
  ): Promise<{ users: GetUserDto[]; message: string }> {
    const logMessage = await this.i18n.translate('user.actions.fetching_all');
    this.logger.log(logMessage);

    try {
      const users = await this.userService.findAllFilter(filtersUserDto);
      const message = await this.i18n.translate('user.success.list');
      return { users, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('user.errors.fetching');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('user.actions.creating');
    this.logger.log(logMessage);

    try {
      const user = await this.userService.createUser(createUserDto);
      const message = await this.i18n.translate('user.success.created');
      this.logger.log(message);
      return { user, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('user.errors.creating');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('user.actions.updating', {
      args: { id },
    });
    this.logger.log(logMessage);

    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      const message = await this.i18n.translate('user.success.updated', {
        args: { id },
      });
      this.logger.log(message);
      return { user: updatedUser, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('user.errors.update');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
