import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import DatabaseRoot from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.local'],
      isGlobal: true,
    }),
    DatabaseRoot,
    ArticleModule,
  ],
})
export class AppModule {}
