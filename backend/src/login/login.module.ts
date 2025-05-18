import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Admin } from 'src/admin/admin.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule { }