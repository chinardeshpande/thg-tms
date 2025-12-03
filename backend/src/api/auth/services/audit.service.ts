import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';

/**
 * Service for logging authentication and security events
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log a generic audit event
   */
  async log(params: {
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          changes: params.changes,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });

      this.logger.log(
        `Audit: ${params.action} on ${params.entity}:${params.entityId} by user ${params.userId || 'system'}`,
      );
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  /**
   * Log user registration
   */
  async logRegistration(
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: userId,
      changes: { email },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log successful login
   */
  async logLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log failed login attempt
   */
  async logFailedLogin(
    email: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      action: 'LOGIN_FAILED',
      entity: 'User',
      entityId: email,
      changes: { reason },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log logout
   */
  async logLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log password change
   */
  async logPasswordChange(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'PASSWORD_CHANGED',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log password reset request
   */
  async logPasswordResetRequest(
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'User',
      entityId: email,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log password reset completion
   */
  async logPasswordReset(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'PASSWORD_RESET',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log email verification
   */
  async logEmailVerification(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'EMAIL_VERIFIED',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log account lockout
   */
  async logAccountLockout(
    userId: string,
    lockoutMinutes: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'ACCOUNT_LOCKED',
      entity: 'User',
      entityId: userId,
      changes: { lockoutMinutes },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log session creation
   */
  async logSessionCreated(
    userId: string,
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'SESSION_CREATED',
      entity: 'Session',
      entityId: sessionId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log session revocation
   */
  async logSessionRevoked(
    userId: string,
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'SESSION_REVOKED',
      entity: 'Session',
      entityId: sessionId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log MFA enabled
   */
  async logMfaEnabled(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'MFA_ENABLED',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log MFA disabled
   */
  async logMfaDisabled(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'MFA_DISABLED',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditLogs(userId: string, limit: number = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditLogs(entity: string, entityId: string, limit: number = 50) {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent audit logs (admin function)
   */
  async getRecentAuditLogs(limit: number = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
