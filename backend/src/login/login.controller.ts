import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post()
    async login(@Body() body: { email: string; password: string }) {
        return this.loginService.login(body.email, body.password);
    }

}
