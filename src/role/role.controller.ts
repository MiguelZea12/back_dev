import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { GetRoleDto } from '@/role/dto/getRole.dto';
import { CreateRoleDto } from '@/role/dto/createRole.dto';
import { UpdateRoleDto } from '@/role/dto/updateRole.dto';
import { FiltersRoleDto } from '@/role/dto/filtersRole.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly i18n: I18nService,
  ) {}

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<GetRoleDto> {
    this.logger.log(
      await this.i18n.t('role.finding_role_by_id', { args: { id } }),
    );

    try {
      return this.roleService.findByOneById(id);
    } catch (error) {
      const errorMsg = await this.i18n.t('role.error_role_not_found', {
        args: { id },
      });
      this.logger.error(errorMsg, error.stack);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAllFiltered(
    @Query() filtersRoleDto: FiltersRoleDto,
  ): Promise<GetRoleDto[]> {
    this.logger.log(await this.i18n.t('role.fetching_all_roles'));

    try {
      return await this.roleService.findAllFilter(filtersRoleDto);
    } catch (error) {
      const errMessage = await this.i18n.t('role.error_fetching_roles');
      this.logger.error(errMessage, error.stack);
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<GetRoleDto> {
    this.logger.log(await this.i18n.t('role.creating_role'));

    try {
      const role = await this.roleService.createRole(createRoleDto);
      this.logger.log(await this.i18n.t('role.role_created'));
      return role;
    } catch (error) {
      const errorMessage = await this.i18n.t('role.error_creating_role');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') id: number,
  ): Promise<GetRoleDto> {
    this.logger.log(await this.i18n.t('role.updating_role', { args: { id } }));

    try {
      const updatedRole = await this.roleService.updateRole(id, updateRoleDto);
      this.logger.log(await this.i18n.t('role.role_updated'));
      return updatedRole;
    } catch (error) {
      const errorMessage = await this.i18n.t('role.error_updating_role');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    this.logger.log(await this.i18n.t('role.deleting_role', { args: { id } }));

    try {
      await this.roleService.deleteRole(id);
      this.logger.log(await this.i18n.t('role.role_deleted'));
    } catch (error) {
      const errorMessage = await this.i18n.t('role.error_deleting_role');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
