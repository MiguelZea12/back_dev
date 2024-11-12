import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@/role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRoleDto } from './dto/getRole.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from '@/role/dto/createRole.dto';
import { UpdateRoleDto } from '@/role/dto/updateRole.dto';
import { FiltersRoleDto } from '@/role/dto/filtersRole.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  // Const Message for Not Found
  private MessageNotFounded(option: string, key: any) {
    return `Rol con ${option}: ${key}, no encontrado.`;
  }

  async findByOneById(id: number): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      const errorMsg = this.MessageNotFounded('ID', id);

      this.logger.error(errorMsg);

      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    const getRoleDto = plainToInstance(GetRoleDto, role);

    return getRoleDto;
  }

  async findByName(name_role: string): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { name_role },
    });

    if (!role) {
      const errorMsg = this.MessageNotFounded('nombre', name_role);

      this.logger.error(errorMsg);

      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    const getRoleDto = plainToInstance(GetRoleDto, role);

    return getRoleDto;
  }

  async findAllFilter(filtersRoleDto: FiltersRoleDto): Promise<any> {
    const { name_role, page = 1, limit = 10 } = filtersRoleDto;

    const query = this.roleRepository.createQueryBuilder('role');

    if (name_role) {
      query.andWhere('role.name_role ILIKE :name_role', {
        name_role: `%${name_role}%`,
      });
    }

    // Order by createdAt in descending order
    query.orderBy('role.createdAt', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    try {
      const [roles, totalCount] = await query.getManyAndCount();

      this.logger.log('Buscando roles..');

      const totalPages = Math.ceil(totalCount / limit);

      const rolePaginated: any = {
        data: roles,
        totalCount,
        rolePerPage: roles.length,
        totalPages,
      };

      return {
        RolePaginated: rolePaginated,
        totalCount,
      };
    } catch (error) {
      const errorMessage = 'Error buscando los Roles';

      this.logger.error(errorMessage, error.stack);

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRole(roleDto: CreateRoleDto): Promise<GetRoleDto> {
    const { name_role } = roleDto;

    const newRole: Role = this.roleRepository.create({ name_role });

    const savedRole = await this.roleRepository.save(newRole);

    const getRoleDto = plainToInstance(GetRoleDto, savedRole);

    const successMsg = 'El Rol ha sido creado existosamente!!';
    this.logger.log(successMsg);

    return getRoleDto;
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      const errorMsg = this.MessageNotFounded('ID', id);
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    if (Object.keys(updateRoleDto).length === 0) {
      const errorMsg = 'Los datos para actualizar no pueden estar vacios';

      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    const updatedRole = await this.roleRepository.save(role);

    const getRoleDto = plainToInstance(GetRoleDto, updatedRole, {
      excludeExtraneousValues: true,
    });

    const successMsg = 'El Rol ha sido actualizado existosamente!!';
    this.logger.log(successMsg);

    return getRoleDto;
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      const errorMsg = 'Rol no econtrado';
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.remove(role);

    const successMsg = 'Rol eliminado exitosamente!!!';

    this.logger.log(successMsg);
  }
}
