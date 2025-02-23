import { Controller, Post, Body, Get, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  async validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix
    return this.authService.validateToken(token);
  }

  @Post('signup')
  signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('username') username: string,
  ) {
    return this.authService.signup(email, password, username);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }
}
