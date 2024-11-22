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
    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  private async createHttpException(messageKey: string, args?: any, status: HttpStatus = HttpStatus.NOT_FOUND): Promise<HttpException> {
    const errorMsg = await this.i18n.translate(messageKey, { args }) as string;
    this.logger.error(errorMsg);
    return new HttpException(errorMsg, status);
  }

  async findByOneById(id: number): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    return plainToInstance(GetRoleDto, role);
  }

  async findByName(name_role: string): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({ where: { name_role } });
    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { name: name_role });
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

    query.orderBy('role.createdAt', 'DESC').skip((page - 1) * limit).take(limit);

    try {
      const [roles, totalCount] = await query.getManyAndCount();
      this.logger.log(await this.i18n.translate('role.fetching_all_roles'));

      const totalPages = Math.ceil(totalCount / limit);
      return {
        roles,
        totalCount,
        totalPages,
      };
    } catch (error) {
      throw await this.createHttpException('role.error_fetching_roles', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRole(roleDto: CreateRoleDto): Promise<GetRoleDto> {
    const newRole = this.roleRepository.create(roleDto);
    const savedRole = await this.roleRepository.save(newRole);

    const successMsg = await this.i18n.translate('role.role_created');
    this.logger.log(successMsg);

    return plainToInstance(GetRoleDto, savedRole);
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<GetRoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    if (Object.keys(updateRoleDto).length === 0) {
      throw await this.createHttpException('role.error_updating_role_empty_data', null, HttpStatus.BAD_REQUEST);
    }

    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.save(role);

    const successMsg = await this.i18n.translate('role.role_updated', { args: { id } });
    this.logger.log(successMsg);

    return plainToInstance(GetRoleDto, updatedRole);
  }

  async deleteRole(id: number): Promise<{ message: string }> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw await this.createHttpException('role.error_role_not_found', { id });
    }

    await this.roleRepository.remove(role);
    const successMsg = await this.i18n.translate('role.role_deleted', { args: { id } });
    this.logger.log(successMsg);

    return { message: successMsg };
  }
}
