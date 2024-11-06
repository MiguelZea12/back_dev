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
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { GetUserDto } from '@/user/dto/getUser.dto';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserDto> {
    this.logger.log(`Buscando usuario con ID: ${id}`);
    try {
      return this.userService.findByOneById(+id);
    } catch (error) {
      this.logger.error(`Usuario no econtrado con ID: ${id}`, error.stack);

      throw new HttpException(
        `Usuario no econtrado con ID: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    this.logger.log('Creando usuario..');

    try {
      const user = await this.userService.createUser(createUserDto);

      this.logger.log('Usuario creado exitosamente!!');

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMesagge = 'Error creando el usuario';

      this.logger.error(errorMesagge, error.stack);

      throw new HttpException(errorMesagge, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<GetUserDto> {
    this.logger.log(`Actualizando usuario con ID: ${id}`);

    try {
      const updatedUser = await this.userService.updateUser(+id, updateUserDto);

      this.logger.log(`Usuarion con ID: ${id}, actualizado existosamente`);

      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errMessage = 'Error al actualizar el usuario!';

      this.logger.error(errMessage, error.stack);
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
