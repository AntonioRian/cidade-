import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Get()
  getHello(): string {
    return 'API Planium está funcionando!';
  }

  @Get('health/database')
  async checkDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('database/tables')
  async getTables() {
    try {
      const tables = await this.dataSource.query(
        "SELECT name FROM sqlite_master WHERE type='table'",
      );
      return { tables };
    } catch (error) {
      return { error: error.message };
    }
  }
}
