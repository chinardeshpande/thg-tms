import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  SessionResponseDto,
  ListSessionsResponseDto,
  RevokeAllSessionsDto,
} from '../dto/session.dto';

@ApiTags('auth/sessions')
@Controller('auth/sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active sessions for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of active sessions',
    type: ListSessionsResponseDto,
  })
  async listSessions(@Request() req: any): Promise<ListSessionsResponseDto> {
    const sessions = await this.sessionService.getUserSessions(req.user.id);
    return {
      sessions,
      total: sessions.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Session details',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('id') id: string, @Request() req: any): Promise<SessionResponseDto> {
    return this.sessionService.getSessionById(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiResponse({ status: 204, description: 'Session revoked successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async revokeSession(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.sessionService.revokeSession(id, req.user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all sessions (logout everywhere)' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked',
    schema: {
      type: 'object',
      properties: {
        revoked: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  async revokeAllSessions(
    @Body() revokeAllDto: RevokeAllSessionsDto,
    @Request() req: any,
  ): Promise<{ revoked: number; message: string }> {
    const currentSessionId = req.sessionId; // Will be added when we enhance auth service
    const result = await this.sessionService.revokeAllSessions(
      req.user.id,
      revokeAllDto.exceptCurrent ? currentSessionId : undefined,
    );

    return {
      revoked: result.revoked,
      message: revokeAllDto.exceptCurrent
        ? 'All other sessions have been revoked'
        : 'All sessions have been revoked',
    };
  }

  @Get('count/active')
  @ApiOperation({ summary: 'Get count of active sessions' })
  @ApiResponse({
    status: 200,
    description: 'Active session count',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  async getActiveSessionCount(@Request() req: any): Promise<{ count: number }> {
    const count = await this.sessionService.getActiveSessionCount(req.user.id);
    return { count };
  }
}
