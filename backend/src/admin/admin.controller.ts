import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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
