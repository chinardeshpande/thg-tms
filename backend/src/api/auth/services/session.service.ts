import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { CreateSessionDto, SessionResponseDto } from '../dto/session.dto';
import { Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new session for a user
   */
  async createSession(createSessionDto: CreateSessionDto): Promise<SessionResponseDto> {
    const session = await this.prisma.session.create({
      data: {
        userId: createSessionDto.userId,
        token: createSessionDto.token,
        expiresAt: createSessionDto.expiresAt,
        ipAddress: createSessionDto.ipAddress,
        userAgent: createSessionDto.userAgent,
        isActive: true,
      },
    });

    return this.toSessionResponse(session);
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(), // Only return non-expired sessions
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map(session => this.toSessionResponse(session));
  }

  /**
   * Get a specific session by ID
   */
  async getSessionById(sessionId: string, userId: string): Promise<SessionResponseDto> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        isActive: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.toSessionResponse(session);
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  /**
   * Revoke all sessions for a user (except optionally the current one)
   */
  async revokeAllSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<{ revoked: number }> {
    const result = await this.prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
        ...(currentSessionId ? { id: { not: currentSessionId } } : {}),
      },
      data: {
        isActive: false,
      },
    });

    return { revoked: result.count };
  }

  /**
   * Revoke session by token
   */
  async revokeSessionByToken(token: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { token },
      data: { isActive: false },
    });
  }

  /**
   * Validate if a session is active and not expired
   */
  async validateSession(token: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        token,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return session;
  }

  /**
   * Clean up expired sessions (can be run as a cron job)
   */
  async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    const result = await this.prisma.session.deleteMany({
      where: {
        OR: [
          {
            expiresAt: {
              lt: new Date(),
            },
          },
          {
            isActive: false,
          },
        ],
      },
    });

    return { deleted: result.count };
  }

  /**
   * Update session activity (extend session)
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        // Could add lastActivityAt field to track this
      },
    });
  }

  /**
   * Get session count for a user
   */
  async getActiveSessionCount(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  /**
   * Convert Session entity to SessionResponseDto
   */
  private toSessionResponse(session: Session): SessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent || undefined,
      isActive: session.isActive,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  }
}
