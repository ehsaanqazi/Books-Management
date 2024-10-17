import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { AccessTokenGuard } from 'src/users/access-token.guard';
import { UserService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/helper/api_response';

@Controller('api/books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly userService: UserService,
  ) {}

  // POST /books - Add a new book
  @UseGuards(AccessTokenGuard)
  @Post()
  async addBook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Response<ApiResponse>> {
    try {
      const user = await this.userService.getUserFromAccessToken(req);
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
        });
      }

      const newBook = await this.booksService.addBook(createBookDto);

      if (newBook) {
        return res.status(201).json({
          status: true,
          message: 'Book added successfully',
        });
      }

      return res.status(400).json({
        status: false,
        message: 'Failed to add book',
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // GET /books - Get all books
  @UseGuards(AccessTokenGuard)
  @Get()
  async getBooks(@Res() res: Response): Promise<Response<ApiResponse>> {
    try {
      const books = await this.booksService.getBooks();
      if (!books || books.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'No books found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Books retrieved successfully',
        data: books,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getBook(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<ApiResponse>> {
    try {
      const book = await this.booksService.findBookById(id);
      if (!book) {
        return res.status(404).json({
          status: false,
          message: 'Book not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Book retrieved successfully',
        data: book,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // PUT /books/:id - Update a book's information
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async updateBook(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Response<ApiResponse>> {
    try {
      const user = await this.userService.getUserFromAccessToken(req);
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
        });
      }

      const book = await this.booksService.findBookById(id);

      if (!book) {
        return res.status(404).json({
          status: false,
          message: 'Book not found',
        });
      }

      const updatedBook = await this.booksService.updateBook(id, createBookDto);

      if (updatedBook) {
        return res.status(200).json({
          status: true,
          message: 'Book updated successfully',
          data: updatedBook,
        });
      }

      return res.status(400).json({
        status: false,
        message: 'Failed to update book',
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // DELETE /books/:id - Delete a book
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteBook(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<ApiResponse>> {
    try {
      const user = await this.userService.getUserFromAccessToken(req);
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
        });
      }

      const book = await this.booksService.findBookById(id);

      if (!book) {
        return res.status(404).json({
          status: false,
          message: 'Book not found',
        });
      }

      const result = await this.booksService.deleteBook(id);

      if (result) {
        return res.status(200).json({
          status: true,
          message: 'Book deleted successfully',
        });
      }

      return res.status(400).json({
        status: false,
        message: 'Failed to delete book',
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}
