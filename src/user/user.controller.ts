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
import { GetUserDto } from '@/user/dto/getUser.dto';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';
import { FiltersUserDto } from './dto/filtersUser.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<GetUserDto> {
    this.logger.log(
      await this.i18n.t('user.finding_user_by_id', { args: { id } }),
    );

    try {
      return this.userService.findByOneById(id);
    } catch (error) {
      const errorMsg = await this.i18n.t('user.error_user_not_found', {
        args: { id },
      });
      this.logger.error(errorMsg, error.stack);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAllFiltered(
    @Query() filtersUserDto: FiltersUserDto,
  ): Promise<GetUserDto[]> {
    this.logger.log(await this.i18n.t('user.fetching_all_users'));

    try {
      return await this.userService.findAllFilter(filtersUserDto);
    } catch (error) {
      const errorMsg = await this.i18n.t('user.error_fetching_users');
      this.logger.error(errorMsg, error.stack);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    this.logger.log(await this.i18n.t('user.creating_user'));

    try {
      const user = await this.userService.createUser(createUserDto);
      this.logger.log(await this.i18n.t('user.user_created'));
      return user;
    } catch (error) {
      const errorMsg = await this.i18n.t('user.error_creating_user');
      this.logger.error(errorMsg, error.stack);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<GetUserDto> {
    this.logger.log(await this.i18n.t('user.updating_user', { args: { id } }));

    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      this.logger.log(await this.i18n.t('user.user_updated'));
      return updatedUser;
    } catch (error) {
      const errorMsg = await this.i18n.t('user.error_updating_user');
      this.logger.error(errorMsg, error.stack);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
