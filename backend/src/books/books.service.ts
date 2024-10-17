import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    return book;
  }

  // Add a new book
  async addBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  // Get the list of all books
  async getBooks(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  // Update a book's information
  async updateBook(id: number, createBookDto: CreateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    Object.assign(book, createBookDto);
    return await this.bookRepository.save(book);
  }

  // Delete a book
  async deleteBook(id: number): Promise<boolean> {
    const result = await this.bookRepository.delete(id);

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
