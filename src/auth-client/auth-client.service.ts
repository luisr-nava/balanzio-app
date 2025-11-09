import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create.dto';
import { envs } from '../config/envs';

@Injectable()
export class AuthClientService {
  private readonly baseUrl = `${envs.authServiceUrl}/auth`;
  constructor(private readonly http: HttpService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { data } = await this.http.axiosRef.post(
        `${this.baseUrl}/register`,
        createUserDto,
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        throw new HttpException(data, status);
      }
      throw new HttpException(
        { message: 'Error al comunicarse con Auth Service' },
        500,
      );
    }
  }

  async login(loginUserDto: LoginDto) {
    try {
      const { data } = await this.http.axiosRef.post(
        `${this.baseUrl}/login`,
        loginUserDto,
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        throw new HttpException(data, status);
      }

      throw new HttpException(
        { message: 'Error al comunicarse con Auth Service' },
        500,
      );
    }
  }

  async registerEmployee(createEmployeeDto: CreateUserDto) {}
  async validateToken(token: string) {
    const { data } = await this.http.axiosRef.get(`${this.baseUrl}/get-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
}
