import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        if (isDevelopment) {
          // Configuração SQLite para desenvolvimento
          return {
            type: 'sqlite',
            database: configService.get('DB_DATABASE_DEV'),
            entities: [User],
            synchronize: true,
            logging: true,
          };
        } else {
          // Configuração PostgreSQL para produção
          return {
            type: 'postgres',
            host: configService.get('DB_HOST_PROD'),
            port: configService.get('DB_PORT_PROD'),
            username: configService.get('DB_USERNAME_PROD'),
            password: configService.get('DB_PASSWORD_PROD'),
            database: configService.get('DB_DATABASE_PROD'),
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            synchronize: false,
            ssl:
              configService.get('NODE_ENV') === 'production'
                ? { rejectUnauthorized: false }
                : false,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
