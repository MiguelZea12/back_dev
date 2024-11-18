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
  Delete,
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
  async findRoleById(@Param('id') id: number): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('finding_user_by_id', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const user = await this.userService.findByOneById(id);
      const message = await this.i18n.translate('user_found') as string;
      return { user, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_user_not_found', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAllFiltered(
    @Query() filtersUserDto: FiltersUserDto,
  ): Promise<{ users: GetUserDto[]; message: string }> {
    const logMessage = await this.i18n.translate('fetching_all_users') as string;
    this.logger.log(logMessage);

    try {
      const users = await this.userService.findAllFilter(filtersUserDto);
      const message = await this.i18n.translate('users_list') as string;
      return { users, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_fetching_users') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('creating_user') as string;
    this.logger.log(logMessage);

    try {
      const user = await this.userService.createUser(createUserDto);
      const message = await this.i18n.translate('user_created') as string;
      this.logger.log(message);
      return { user, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_creating_user') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<{ user: GetUserDto; message: string }> {
    const logMessage = await this.i18n.translate('updating_user', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      const message = await this.i18n.translate('user_updated', { args: { id } }) as string;
      this.logger.log(message);
      return { user: updatedUser, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_updating_user') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    this.logger.log(`Eliminando el usuario con ID: ${id}`);

    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errMessage = 'Error en la eliminación del Rol';

      this.logger.error(errMessage);

      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
