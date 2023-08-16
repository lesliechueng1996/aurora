import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseRoot from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.local'],
      isGlobal: true,
    }),
    DatabaseRoot,
  ],
})
export class AppModule {}
