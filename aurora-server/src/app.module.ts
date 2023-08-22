import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseRoot from './config/database.config';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.local'],
      isGlobal: true,
    }),
    DatabaseRoot,
    CategoryModule,
  ],
})
export class AppModule {}
