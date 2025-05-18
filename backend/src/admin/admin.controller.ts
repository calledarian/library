import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    async create(@Body() admin: Admin): Promise<Admin> {
        return this.adminService.addAdmin(admin);
    }

    @Get()
    async findAll(): Promise<Admin[]> {
        return this.adminService.getAllAdmins();
    }
}
