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
import { PatientsModule } from '@/patients/patients.module';
import { CaregiversModule } from '@/Caregiver/caregivers.module';
import { RoleModule } from '@/role/role.module';
import { TeamsModule } from '@/team/teams.module';
import { AssignmentsModule } from '@/assignment/assignments.module';
import { WorkGroupsModule } from '@/workgroup/workgroups.module';
import { EmailModule } from '@/services/email/email.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';

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
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE', 'en'),
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
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
    EmailModule,
    EmailTemplateModule,
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
