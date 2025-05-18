import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
    ) { }

    async addAdmin(admin: Admin): Promise<Admin> {
        console.log(`${admin.email} has created at ${admin.createdAt}`)
        return this.adminRepository.save(admin);
    }

    async getAllAdmins(): Promise<Admin[]> {
        return this.adminRepository.find();
    }
}
