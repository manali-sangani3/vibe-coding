import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { UserSession } from './entities/session.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
  ) {}

  async ssoLogin(ssoToken: string) {
    if (!ssoToken || ssoToken === 'invalid_token') {
      throw new UnauthorizedException('Invalid or expired SSO token.');
    }

    // Determine target user based on mock token pattern
    let targetEmail = 'emp1@enterprise.com'; // Default to employee
    const tokenLower = ssoToken.toLowerCase();

    if (tokenLower.includes('manager')) {
      targetEmail = 'mgr1@enterprise.com';
    } else if (tokenLower.includes('finance')) {
      targetEmail = 'fin1@enterprise.com';
    } else if (tokenLower.includes('compliance')) {
      targetEmail = 'comp1@enterprise.com';
    } else if (tokenLower.includes('admin')) {
      targetEmail = 'admin1@enterprise.com';
    }

    const user = await this.userRepository.findOne({ where: { email: targetEmail } });
    if (!user) {
      throw new UnauthorizedException('SSO authenticated user not registered in local database.');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const hash = this.hashToken(refreshToken);
    const session = await this.sessionRepository.findOne({
      where: { tokenHash: hash, isRevoked: false },
      relations: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        session.isRevoked = true;
        await this.sessionRepository.save(session);
      }
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    // Revoke old session token (rotation logic)
    session.isRevoked = true;
    await this.sessionRepository.save(session);

    // Generate new token pair
    return this.generateTokens(session.user);
  }

  async logout(userId: string) {
    // Revoke all active sessions for this user
    await this.sessionRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Access token (e.g. 1 hour)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    // Refresh token (e.g. 7 days)
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshHash = this.hashToken(rawRefreshToken);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Persist refresh session
    const session = this.sessionRepository.create({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt,
    });
    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
