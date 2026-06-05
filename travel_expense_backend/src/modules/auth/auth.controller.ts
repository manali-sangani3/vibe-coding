import { Controller, Post, Get, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';

class SsoLoginDto {
  @ApiProperty({ description: 'Mock SSO token parameter' })
  @IsString()
  @IsNotEmpty()
  ssoToken: string;
}

class RefreshTokenDto {
  @ApiProperty({ description: 'User active JWT rotation refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sso-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSO Login exchange' })
  @ApiResponse({ status: 200, description: 'SSO token validated and JWT issued successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired SSO token' })
  async ssoLogin(@Body() body: SsoLoginDto) {
    return this.authService.ssoLogin(body.ssoToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate JWT access and refresh token pair' })
  @ApiResponse({ status: 200, description: 'Tokens rotated successfully' })
  @ApiResponse({ status: 401, description: 'Refresh token invalid or revoked' })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke refresh tokens and logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.id);
    return { success: true, message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve logged-in user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  async getProfile(@Req() req: any) {
    return {
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        department: req.user.department,
        avatarUrl: req.user.avatarUrl,
      },
    };
  }
}
