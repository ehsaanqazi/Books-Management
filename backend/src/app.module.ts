import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BooksModule } from './books/books.module';
import { Book } from './books/entity/book.entity';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';
import { User } from './users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './users/access-token.strategy';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 1000,
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, User]),
    BooksModule,
    UsersModule,
  ],
  controllers: [AppController, BooksController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    BooksService,
    UserService,
    JwtService,
    AccessTokenStrategy,
  ],
})
export class AppModule {}
