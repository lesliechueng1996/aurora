import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseRoot from './config/database.config';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { ArticleModule } from './modules/article/article.module';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.local'],
      isGlobal: true,
    }),
    DatabaseRoot,
    CategoryModule,
    TagModule,
    ArticleModule,
    MenuModule,
  ],
})
export class AppModule {}
