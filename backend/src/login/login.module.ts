import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Admin } from 'src/admin/admin.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        AuthModule
    ],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule { }