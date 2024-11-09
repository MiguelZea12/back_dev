import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataBaseConfig } from '@/config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PatientsModule } from './patients/patients.module';
import { CaregiversModule } from './Caregiver/caregivers.module';
import { RoleModule } from './role/role.module';
import { TeamsModule } from './team/teams.module';
import { AssignmentsModule } from './assignment/assignments.module';
import { WorkGroupsModule } from './workgroup/workgroups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        ...dataBaseConfig,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PatientsModule,
    CaregiversModule,
    TeamsModule,
    AssignmentsModule,
    WorkGroupsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: 'role', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
