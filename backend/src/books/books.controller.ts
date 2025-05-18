import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { timestamp } from 'rxjs';

@Controller('/books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    async addBook(@Body() book: Book) {
        return this.booksService.addBook(book);
    }

    @Get()
    async getBooks() {
        return this.booksService.getBooks();
    }

    @Get(':id')
    async getBooksById(@Param('id') id: number) {
        return this.booksService.getBookById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.booksService.deleteBookById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<Book>): Promise<Book> {
        return this.booksService.updateBookById(id, updateData);
    }
}
