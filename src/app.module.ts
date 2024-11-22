import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';
import { dataBaseConfig } from '@/config/database.config';

// Importa los módulos de tu aplicación
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { PatientsModule } from '@/patients/patients.module';
import { CaregiversModule } from '@/Caregiver/caregivers.module';
import { RoleModule } from '@/role/role.module';
import { TeamsModule } from '@/team/teams.module';
import { AssignmentsModule } from '@/assignment/assignments.module';
import { WorkGroupsModule } from '@/workgroup/workgroups.module';
import { EmailModule } from '@/services/email/email.module';
import { EmailTemplateModule } from '@/email-template/email-template.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

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
      useFactory: () => ({
        fallbackLanguage: 'en', // Idioma predeterminado
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'), // Ruta de los archivos de traducción
          watch: true, // Habilita la observación de cambios en los archivos
        },
        resolvers: [
          new QueryResolver(), // Resolver para ?lang=en
          new HeaderResolver(['custom-lang']),
          AcceptLanguageResolver // Resolver para el encabezado Accept-Language
        ],
      })
    }),
    UserModule,
    AuthModule,
    PatientsModule,
    CaregiversModule,
    RoleModule,
    TeamsModule,
    AssignmentsModule,
    WorkGroupsModule,
    EmailModule,
    EmailTemplateModule,

  ],
  controllers: [AppController],
  providers: [AppService,I18nModule],
})
export class AppModule { }
