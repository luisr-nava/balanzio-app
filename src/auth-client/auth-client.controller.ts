import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create.dto';
import { GetUser } from './decorators/get-user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth-client')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}
  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    return this.authClientService.login(loginUserDto);
  }
  
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authClientService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register-employee')
  async registerEmployee(@Body() createEmployeeDto: CreateUserDto) {
    return this.authClientService.registerEmployee(createEmployeeDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authClientService.validateToken(token);
  }
}
//  TODO: Create EP update
