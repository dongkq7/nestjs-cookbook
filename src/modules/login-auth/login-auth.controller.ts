import { GoogleInfo, LoginAuthService } from './login-auth.service';
import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IsPublic } from './is-public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('login-auth')
export class LoginAuthController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private authService: LoginAuthService;

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    console.log(req.user);
    const user = req.user;
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return {
      token,
    };
  }

  @Get('login')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  authCallback(@Req() req: Request) {
    return this.authService.findUserByGithubId(req.user.id + '');
  }

  @Get('testJwtAuth')
  @IsPublic()
  @UseGuards(JwtAuthGuard)
  testJwtAuth(@Req() req: Request) {
    console.log(req.user);
    return ['1', '2', '3'];
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() request: Request) {
    const user = await this.authService.findGoogleUserByEmail(
      request.user.email!,
    );

    if (!user) {
      const newUser = this.authService.registerByGoogleInfo(
        request.user as GoogleInfo,
      );
      return newUser;
    } else {
      return user;
    }
  }
}
