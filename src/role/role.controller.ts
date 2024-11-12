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

@Controller('role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<GetRoleDto> {
    this.logger.log(`Buscando rol con ID: ${id}`);

    try {
      return this.roleService.findByOneById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Rol no econtrado con ID: ${id}`, error.stack);

      throw new HttpException(
        `Rol no econtrado con ID: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get()
  async findAllFiltered(
    @Query() filtersSiteDto: FiltersRoleDto,
  ): Promise<GetRoleDto[]> {
    this.logger.log('Obteniendo todos los Roles de la base de datos');

    try {
      return await this.roleService.findAllFilter(filtersSiteDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errMessage = 'Error al obtener los Roles';

      this.logger.error(errMessage, error.stack);

      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<GetRoleDto> {
    this.logger.log('Creando rol...');

    try {
      const role = await this.roleService.createRole(createRoleDto);

      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMesagge = 'Error creando el rol';

      this.logger.error(errorMesagge, error.stack);

      throw new HttpException(errorMesagge, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') id: number,
  ): Promise<GetRoleDto> {
    this.logger.log(`Actualizando usuario con ID: ${id}....`);

    try {
      const updatedRole = await this.roleService.updateRole(id, updateRoleDto);

      return updatedRole;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errMessage = 'Error al actualizar el Rol!!';

      this.logger.error(errMessage, error.stack);
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    this.logger.log(`Eliminando el rol con ID: ${id}`);

    try {
      await this.roleService.deleteRole(id);
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
