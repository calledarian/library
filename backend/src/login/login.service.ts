// src/auth/login.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
        private readonly jwtService: JwtService,
    ) { }

    async validateAdmin(email: string, password: string): Promise<Admin> {
        const admin = await this.adminRepo.findOne({ where: { email, password } });
        if (!admin) throw new UnauthorizedException('Invalid credentials');
        return admin;
    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        console.log('Trying login with:', email, password);

        const admin = await this.validateAdmin(email, password);
        const payload = { sub: admin.id, email: admin.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

}
