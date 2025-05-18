import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('/books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    @UseGuards(AuthGuard('jwt'))
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
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.booksService.deleteBookById(id);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<Book>): Promise<Book> {
        return this.booksService.updateBookById(id, updateData);
    }
}
