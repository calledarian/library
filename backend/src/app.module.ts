import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      })
    }),

    // TypeOrmModule sets up DB connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      }),
    }),

    BooksModule,

    AdminModule,

    LoginModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
