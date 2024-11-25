import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@/role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRoleDto } from './dto/getRole.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from '@/role/dto/createRole.dto';
import { UpdateRoleDto } from '@/role/dto/updateRole.dto';
import { FiltersRoleDto } from '@/role/dto/filtersRole.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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

  async findByOneById(id: number): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    return plainToInstance(GetRoleDto, role);
  }

  async findByName(name_role: string): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { name_role },
    });

    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', {
        name_role,
      });
    }

    return plainToInstance(GetRoleDto, role);
  }

  async findAllFilter(filtersRoleDto: FiltersRoleDto): Promise<any> {
    const { name_role, page = 1, limit = 10 } = filtersRoleDto;

    const query = this.roleRepository.createQueryBuilder('role');

    if (name_role) {
      query.andWhere('role.name_role ILIKE :name_role', {
        name_role: `%${name_role}%`,
      });
    }

    query.orderBy('role.createdAt', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    try {
      const [roles, totalCount] = await query.getManyAndCount();

      this.logger.log(await this.i18n.t('role.roles_list'));

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: roles,
        totalCount,
        rolePerPage: roles.length,
        totalPages,
      };
    } catch (error) {
      const errorMessage = await this.i18n.t('role.error_fetching_roles');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRole(roleDto: CreateRoleDto): Promise<GetRoleDto> {
    const { name_role } = roleDto;

    const newRole: Role = this.roleRepository.create({ name_role });
    const savedRole = await this.roleRepository.save(newRole);

    this.logger.log(await this.i18n.t('role.role_created'));

    return plainToInstance(GetRoleDto, savedRole);
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    if (Object.keys(updateRoleDto).length === 0) {
      const errorMsg = await this.i18n.t('role.error_updating_role');
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.save(role);

    this.logger.log(await this.i18n.t('role.role_updated'));

    return plainToInstance(GetRoleDto, updatedRole);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    await this.roleRepository.remove(role);

    this.logger.log(await this.i18n.t('role.role_deleted'));
  }
}
