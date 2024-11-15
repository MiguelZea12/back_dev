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
import { I18nService } from 'nestjs-i18n';
import { GetRoleDto } from '@/role/dto/getRole.dto';
import { CreateRoleDto } from '@/role/dto/createRole.dto';
import { UpdateRoleDto } from '@/role/dto/updateRole.dto';
import { FiltersRoleDto } from '@/role/dto/filtersRole.dto';

@Controller('role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly i18n: I18nService,
  ) {}

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<{ role: GetRoleDto; message: string }> {
    const logMessage = await this.i18n.translate('finding_role_by_id', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const role = await this.roleService.findByOneById(id);
      const message = await this.i18n.translate('role_found') as string;
      return { role, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_role_not_found', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAllFiltered(@Query() filtersSiteDto: FiltersRoleDto): Promise<{ roles: GetRoleDto[]; message: string }> {
    const logMessage = await this.i18n.translate('fetching_all_roles') as string;
    this.logger.log(logMessage);

    try {
      const roles = await this.roleService.findAllFilter(filtersSiteDto);
      const message = await this.i18n.translate('roles_list') as string;
      return { roles, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_fetching_roles') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<{ role: GetRoleDto; message: string }> {
    const logMessage = await this.i18n.translate('creating_role') as string;
    this.logger.log(logMessage);

    try {
      const role = await this.roleService.createRole(createRoleDto);
      const message = await this.i18n.translate('role_created') as string;
      return { role, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_creating_role') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto, @Param('id') id: number): Promise<{ role: GetRoleDto; message: string }> {
    const logMessage = await this.i18n.translate('updating_role', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const updatedRole = await this.roleService.updateRole(id, updateRoleDto);
      const message = await this.i18n.translate('role_updated', { args: { id } }) as string;
      return { role: updatedRole, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_updating_role') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('deleting_role', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      await this.roleService.deleteRole(id);
      const message = await this.i18n.translate('role_deleted') as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('error_deleting_role') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
